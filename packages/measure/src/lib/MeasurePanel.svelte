<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { TerrainRGB } from '@watergis/terrain-rgb';
	import distance from '@turf/distance';
	import { Marker, MapMouseEvent, GeoJSONFeature, Map } from 'maplibre-gl';
	import { measureControlData } from './stores';
	import type { MeasureControlData, ElevationOption } from './types';

	export let map: Map;
	export let elevationOption: ElevationOption;

	const SOURCE_LINE = 'elev-controls-source-line';
	const LAYER_LINE = 'elev-controls-layer-line';
	const LAYER_SYMBOL = 'elev-controls-layer-symbol';
	const SOURCE_SYMBOL = 'elev-controls-source-symbol';

	let isQuery: boolean;
	let units = elevationOption.options?.units || 'kilometers';

	let hasData = false;

	onMount(() => {
		if (!$measureControlData) {
			const data: MeasureControlData = {
				markers: [],
				coordinates: [],
				elevations: []
			};
			measureControlData.update(() => data);
		} else {
			if ($measureControlData.coordinates.length > 0) {
				hasData = true;
			}
		}
	});

	onDestroy(() => {
		if (isQuery === true) {
			measuringOff();
		}
	});

	const measureStart = () => {
		if (isQuery) {
			measuringOff();
		} else {
			measuringOn();
		}
	};

	const measuringOn = () => {
		if (map) {
			map.getCanvas().style.cursor = 'crosshair';
			isQuery = true;
			map.on('click', mapClickListener);
			map.fire('elevation.on');
		}
	};

	const measuringOff = () => {
		isQuery = false;
		if (map) {
			map.getCanvas().style.cursor = '';
			map.off('click', mapClickListener);
			map.fire('elevation.off');
		}
	};

	const clearFeatures = () => {
		if (map) {
			if (map.getLayer(LAYER_LINE)) map.removeLayer(LAYER_LINE);
			if (map.getLayer(LAYER_SYMBOL)) map.removeLayer(LAYER_SYMBOL);
			if (map.getSource(SOURCE_LINE)) map.removeSource(SOURCE_LINE);
			if (map.getSource(SOURCE_SYMBOL)) map.removeSource(SOURCE_SYMBOL);
		}
		$measureControlData.markers.forEach((m) => m.remove());
		hasData = false;
	};

	const mapClickListener = (event: MapMouseEvent) => {
		if (!map?.getSource(SOURCE_LINE) || !map?.getSource(SOURCE_SYMBOL)) {
			clearFeatures();
			initFeatures();
		}
		let zoom = map?.getZoom();
		if (!zoom) {
			zoom = 15;
		}
		zoom = Math.round(zoom);
		const lnglat: number[] = [event.lngLat.lng, event.lngLat.lat];
		const trgb = new TerrainRGB(elevationOption.url, elevationOption.options?.tileSize);
		trgb.getElevation(lnglat, zoom).then((elev: number) => {
			if (!elev) elev = -1;
			if (map) {
				const marker = new Marker({
					draggable: true
				})
					.setLngLat(event.lngLat)
					.addTo(map);
				$measureControlData.markers.push(marker);

				$measureControlData.coordinates.push([lnglat[0], lnglat[1], elev]);
				$measureControlData.elevations.push(elev);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				map.getSource(SOURCE_LINE).setData(geoLineString($measureControlData.coordinates));
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				map.getSource(SOURCE_SYMBOL).setData(geoPoint($measureControlData.coordinates));

				hasData = true;
			}
		});
	};

	const initFeatures = () => {
		$measureControlData.markers = [];
		$measureControlData.coordinates = [];
		$measureControlData.elevations = [];
		if (map) {
			map.addSource(SOURCE_LINE, {
				type: 'geojson',
				data: geoLineString($measureControlData.coordinates)
			});
			map.addSource(SOURCE_SYMBOL, {
				type: 'geojson',
				data: geoPoint($measureControlData.coordinates)
			});
			map.addLayer({
				id: LAYER_LINE,
				type: 'line',
				source: SOURCE_LINE,
				paint: {
					'line-color': elevationOption.options?.mainColor,
					'line-width': 2
				}
			});
			map.addLayer({
				id: LAYER_SYMBOL,
				type: 'symbol',
				source: SOURCE_SYMBOL,
				layout: {
					'text-field': '{text}',
					'text-font': elevationOption.options?.font,
					'text-size': elevationOption.options?.fontSize,
					'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
					'text-radial-offset': 0.8,
					'text-justify': 'auto'
				},
				paint: {
					'text-color': elevationOption.options?.mainColor,
					'text-halo-color': elevationOption.options?.haloColor,
					'text-halo-width': elevationOption.options?.fontHalo
				}
			});
		}
	};

	const labelFormat = (length: number, elevation: number) => {
		let lengthLabel = `${length.toFixed(2)} km`;
		if (length < 1) {
			lengthLabel = `${(length * 1000).toFixed()} m`;
		}
		let elevLabel = '';
		if (elevation > 0) {
			elevLabel = `\nalt.${elevation}m`;
		}
		return `${lengthLabel}${elevLabel}`;
	};

	const geoLineString = (coordinates: number[][] = []): GeoJSONFeature => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates
			}
		};
	};

	const geoPoint = (coordinates: number[][] = []): GeoJSONFeature => {
		let sum = 0;
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			type: 'FeatureCollection',
			features: coordinates.map((c, i) => {
				if (i > 0) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					sum += distance(coordinates[i - 1], coordinates[i], { units });
				}
				return {
					type: 'Feature',
					properties: {
						id: i + 1,
						text: labelFormat(sum, c[2]),
						elevation: c[2],
						length: (sum * 1000).toFixed()
					},
					geometry: {
						type: 'Point',
						coordinates: c
					}
				};
			})
		};
	};

	const downloadGeoJSON = () => {
		if ($measureControlData.coordinates.length === 0) return;
		const points = geoPoint($measureControlData.coordinates);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		points.features.forEach((f) => {
			delete f.properties.text;
		});
		if ($measureControlData.coordinates.length > 1) {
			const line = geoLineString($measureControlData.coordinates);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			points.features.push(line);
		}
		const fileName = 'measure_result.geojson';
		const content = JSON.stringify(points);
		download(fileName, content);
	};

	const download = (fileName: string, content: string) => {
		const blob = new Blob([content], { type: 'text/plain' });
		const aTag = document.createElement('a');
		aTag.href = URL.createObjectURL(blob);
		aTag.setAttribute('download', fileName);
		aTag.dispatchEvent(new MouseEvent('click'));
	};
</script>

{#if elevationOption}
	<div class="columns is-vcentered">
		<div class="column">
			<button class="button is-fullwidth is-link" on:click={() => measureStart()}>
				<span class="icon is-small">
					{#if isQuery}
						<i class="fas fa-stop" />
					{:else}
						<i class="fas fa-ruler" />
					{/if}
				</span>
				<span>
					{#if isQuery}
						Stop measure
					{:else}
						Start measure
					{/if}
				</span>
			</button>
		</div>
	</div>
	{#if hasData}
		<div class="columns is-vcentered pb-3">
			<div class="column is-half py-0">
				<button class="button is-fullwidth is-link is-light" on:click={() => clearFeatures()}>
					<span class="icon is-small">
						<i class="fas fa-trash" />
					</span>
					<span> Clear </span>
				</button>
			</div>
			<div class="column is-half py-0">
				<button class="button is-fullwidth is-link is-light" on:click={() => downloadGeoJSON()}>
					<span class="icon is-small">
						<i class="fas fa-download" />
					</span>
					<span> GeoJSON </span>
				</button>
			</div>
		</div>
	{/if}
{/if}

<style>
	@import 'style/fa/css/all.css';
</style>
