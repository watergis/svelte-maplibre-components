<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map, GeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
	import { valhallaRoutingData } from '$lib/stores';
	import type {
		ValhallaTripResult,
		ValhallaTripSummary,
		ValhallaError,
		RoutingStyle
	} from './interfaces';
	import { costingOptions } from '$lib/constants';

	export let map: Map;
	export let url: string;
	export let options: RoutingStyle;

	const SOURCE_LINE = 'routing-controls-source-line';
	const LAYER_LINE = 'routing-controls-layer-line';
	const LAYER_LINE_LABEL = 'routing-controls-layer-line-label';
	const LAYER_SYMBOL = 'routing-controls-layer-symbol';
	const SOURCE_SYMBOL = 'routing-controls-source-symbol';

	let isRouting = false;

	let meansOfTransport = costingOptions[0].value;
	let tripSummary: ValhallaTripSummary | undefined;

	let errorMessage = '';

	onMount(() => {
		if (!$valhallaRoutingData) {
			valhallaRoutingData.update(() => []);
		}
	});

	onDestroy(() => {
		if (isRouting === true) {
			addingPointOff();
		}
	});

	const handleAddPoint = () => {
		if (isRouting) {
			addingPointOff();
		} else {
			addingPointOn();
		}
	};

	const addingPointOn = () => {
		if (map) {
			map.getCanvas().style.cursor = 'crosshair';
			isRouting = true;
			map.on('click', mapClickListener);
			map.fire('routing.on');
		}
	};

	const addingPointOff = () => {
		isRouting = false;
		if (map) {
			map.getCanvas().style.cursor = '';
			map.off('click', mapClickListener);
			map.fire('routing.off');
		}
	};

	const mapClickListener = (event: MapMouseEvent) => {
		const lnglat = event.lngLat;
		if (!$valhallaRoutingData) valhallaRoutingData.update(() => []);
		valhallaRoutingData.update(() => [...$valhallaRoutingData, lnglat]);
	};

	const clearFeatures = () => {
		if (map) {
			if (map.getLayer(LAYER_LINE)) map.removeLayer(LAYER_LINE);
			if (map.getLayer(LAYER_LINE_LABEL)) map.removeLayer(LAYER_LINE_LABEL);
			if (map.getLayer(LAYER_SYMBOL)) map.removeLayer(LAYER_SYMBOL);
			if (map.getSource(SOURCE_LINE)) map.removeSource(SOURCE_LINE);
			if (map.getSource(SOURCE_SYMBOL)) map.removeSource(SOURCE_SYMBOL);
		}
		valhallaRoutingData.update(() => []);
		errorMessage = '';
	};

	$: $valhallaRoutingData, calcRoute();
	$: meansOfTransport, calcRoute();

	const calcRoute = () => {
		if (!$valhallaRoutingData || ($valhallaRoutingData && $valhallaRoutingData.length < 2)) {
			tripSummary = undefined;
			return;
		}
		errorMessage = '';
		const baseAPI = `${url}/route`;
		const params = {
			locations: $valhallaRoutingData.map((pt) => {
				return { lon: pt.lng, lat: pt.lat };
			}),
			costing: meansOfTransport,
			costing_options: { auto: { country_crossing_penalty: 2000.0 } },
			units: 'kilometers',
			id: 'my_work_route'
		};
		const apiUrl = `${baseAPI}?json=${JSON.stringify(params)}`;

		fetch(apiUrl)
			.then((res) => res.json())
			.then((json: ValhallaTripResult | ValhallaError) => {
				if ('error' in json) {
					$valhallaRoutingData.pop(); //remove the last coordinates which cause error
					throw new Error(
						`${json.status} (${json.status_code}): ${json.error} (${json.error_code})`
					);
				}
				let shapes = json.trip.legs.map((s) => decodeShape(s.shape));
				let shape: number[][] = [];
				shapes.forEach((shp) => {
					shape = [...shape, ...shp];
				});
				tripSummary = json.trip.summary;
				tripSummary.length = Number(tripSummary.length.toFixed(2));
				tripSummary.time = Number((tripSummary.time / 60).toFixed());

				const features = {
					type: 'FeatureCollection',
					features: json.trip.legs.map((leg) => {
						const shape = decodeShape(leg.shape);
						const props = {
							length: Number(leg.summary.length.toFixed(2)),
							time: Number((leg.summary.time / 60).toFixed())
						};
						return geoLineString(shape, props);
					})
				};

				const pointFeatures = geoPoint($valhallaRoutingData.map((pt) => [pt.lng, pt.lat]));

				if (map) {
					if (!map.getSource(SOURCE_LINE)) {
						map.addSource(SOURCE_LINE, {
							type: 'geojson',
							data: features
						});
						map.addSource(SOURCE_SYMBOL, {
							type: 'geojson',
							data: pointFeatures
						});
						map.addLayer({
							id: LAYER_LINE,
							type: 'line',
							source: SOURCE_LINE,
							paint: {
								'line-color': 'rgb(255,0,0)',
								'line-width': 4
							}
						});

						map.addLayer({
							id: LAYER_LINE_LABEL,
							type: 'symbol',
							source: SOURCE_LINE,
							layout: {
								'text-field': [
									'concat',
									['to-string', ['get', 'length']],
									' km (',
									['to-string', ['get', 'time']],
									' min)'
								],
								'text-font': options.font,
								'text-size': options.fontSize,
								'symbol-placement': 'line',
								'text-allow-overlap': true,
								'text-ignore-placement': true
							},
							paint: {
								'text-color': options.fontColor,
								'text-halo-color': options.fontHaloColor,
								'text-halo-width': options.fontHalo
							}
						});

						map.addLayer({
							id: LAYER_SYMBOL,
							type: 'symbol',
							source: SOURCE_SYMBOL,
							layout: {
								'icon-image': options.iconImage,
								'icon-size': options.iconSize,
								'text-field': ['get', 'text'],
								'text-font': options.font,
								'text-size': options.fontSize,
								'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
								'text-radial-offset': 0.8,
								'text-justify': 'auto'
							},
							paint: {
								'text-color': options.fontColor,
								'text-halo-color': options.fontHaloColor,
								'text-halo-width': options.fontHalo
							}
						});
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						map.getSource(SOURCE_LINE).setData(features);
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						map.getSource(SOURCE_SYMBOL).setData(pointFeatures);
					}
				}
			})
			.catch((err: ErrorEvent) => {
				errorMessage = err.message;
			});
	};

	const geoLineString = (
		coordinates: number[][] = [],
		props: { [key: string]: string | number } = {}
	): GeoJSONFeature => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return {
			type: 'Feature',
			properties: props,
			geometry: {
				type: 'LineString',
				coordinates
			}
		};
	};

	const geoPoint = (coordinates: number[][] = []): GeoJSONFeature => {
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			type: 'FeatureCollection',
			features: coordinates.map((c, i) => {
				let text = (i + 1).toString();
				if (i === 0) {
					text = 'From';
				} else if (i === coordinates.length - 1) {
					text = 'To';
				}
				return {
					type: 'Feature',
					properties: {
						text
					},
					geometry: {
						type: 'Point',
						coordinates: c
					}
				};
			})
		};
	};

	const decodeShape = (value: string, precision = 6) => {
		let index = 0,
			lat = 0,
			lng = 0,
			coordinates: number[][] = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			factor = Math.pow(10, precision || 6);

		// Coordinates have variable length when encoded, so just keep
		// track of whether we've hit the end of the string. In each
		// loop iteration, a single coordinate is decoded.
		while (index < value.length) {
			// Reset shift, result, and byte
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = value.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

			shift = result = 0;

			do {
				byte = value.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

			lat += latitude_change;
			lng += longitude_change;

			coordinates.push([lng / factor, lat / factor]);
		}

		return coordinates;
	};
</script>

<div class="field">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">Means of Transport</label>
	<div class="control">
		{#each costingOptions as item}
			<label class="radio" style="color:black">
				<input
					type="radio"
					name="transport-routing"
					on:click={() => {
						meansOfTransport = item.value;
					}}
					checked={meansOfTransport === item.value}
				/>
				<div class="icon is-small is-left pl-3 pr-3">
					<i class="fas {item.icon}" />
				</div>
				{item.label}
			</label>
		{/each}
	</div>
</div>

<div class="columns is-vcentered">
	<div class="column">
		<button class="button is-fullwidth is-link" on:click={handleAddPoint}>
			<span class="icon is-small">
				{#if isRouting}
					<i class="fas fa-stop" />
				{:else}
					<i class="fas fa-route" />
				{/if}
			</span>
			<span>
				{#if isRouting}
					Stop routing
				{:else}
					Start routing
				{/if}
			</span>
		</button>
	</div>
</div>

{#if $valhallaRoutingData && $valhallaRoutingData.length > 0}
	<div class="columns is-vcentered">
		<div class="column py-0">
			<button class="button is-fullwidth is-link is-light" on:click={clearFeatures}>
				<span class="icon is-small">
					<i class="fas fa-trash" />
				</span>
				<span> Clear </span>
			</button>
		</div>
	</div>

	<div class="field is-horizontal px-3">
		<div class="field-label is-normal">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">From</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="columns pt-1">
					<div class="column is-half px-0">
						<input
							class="input is-small"
							type="text"
							placeholder="Name"
							value={`${$valhallaRoutingData[0].lng.toFixed(6)}`}
							readonly
						/>
					</div>
					<div class="column is-half px-0">
						<input
							class="input is-small"
							type="text"
							placeholder="Name"
							value={`${$valhallaRoutingData[0].lat.toFixed(6)}`}
							readonly
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if $valhallaRoutingData.length > 1}
		<div class="field is-horizontal px-3">
			<div class="field-label is-normal">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">To</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="columns pt-1 is-mobile">
						<div class="column is-half px-0">
							<input
								class="input is-small"
								type="text"
								placeholder="Name"
								value={`${$valhallaRoutingData[$valhallaRoutingData.length - 1].lng.toFixed(6)}`}
								readonly
							/>
						</div>
						<div class="column is-half px-0">
							<input
								class="input is-small"
								type="text"
								placeholder="Name"
								value={`${$valhallaRoutingData[$valhallaRoutingData.length - 1].lat.toFixed(6)}`}
								readonly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if tripSummary}
		<div class="columns px-3 is-mobile">
			<div class="column is-half px-0">
				<div class="field">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">Length</label>
					<div class="control">
						<input class="input is-small" type="text" value={`${tripSummary.length} km`} readonly />
					</div>
				</div>
			</div>
			<div class="column is-half px-0 is-mobile">
				<div class="field">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">Time</label>
					<div class="control">
						<input class="input is-small" type="text" value={`${tripSummary.time} min`} readonly />
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="notification is-warning">
			<button class="delete" on:click={() => (errorMessage = '')} />
			{errorMessage}
		</div>
	{/if}
{/if}
