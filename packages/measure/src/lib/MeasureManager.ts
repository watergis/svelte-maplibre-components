import { TerrainRGB } from '@watergis/terrain-rgb';
import distance from '@turf/distance';
import {
	Marker,
	type MapMouseEvent,
	type GeoJSONFeature,
	type Map,
	type LngLat
} from 'maplibre-gl';
import type { MeasureControlData, MeasureOption } from './types';

const SOURCE_LINE = 'elev-controls-source-line';
const LAYER_LINE = 'elev-controls-layer-line';
const LAYER_SYMBOL = 'elev-controls-layer-symbol';
const SOURCE_SYMBOL = 'elev-controls-source-symbol';

const DEFAULT_OPTION: MeasureOption = {
	tileSize: 512,
	font: ['Roboto Medium'],
	fontSize: 12,
	fontHalo: 1,
	mainColor: '#263238',
	haloColor: '#fff'
};

class MeasureManager {
	private map: Map;
	private measureOption: MeasureOption = Object.assign({}, DEFAULT_OPTION);
	private terrainRgbUrl: string | undefined;

	private units: string | undefined = 'kilometers';

	private measureControlData: MeasureControlData;

	private isMeasure = false;
	private isClickListenerAdded = false;

	constructor(map: Map, terrainRgbUrl?: string, measureOption?: MeasureOption) {
		this.map = map;
		this.terrainRgbUrl = terrainRgbUrl;
		this.measureOption = Object.assign(this.measureOption, measureOption);

		this.measureControlData = {
			markers: [],
			coordinates: [],
			elevations: []
		};
	}

	hasData() {
		return this.measureControlData && this.measureControlData.coordinates.length > 0;
	}

	measuringOn() {
		if (this.map) {
			this.map.getCanvas().style.cursor = 'crosshair';
			if (!this.isClickListenerAdded) {
				this.map.on('click', this.mapClickListener.bind(this));
				this.isClickListenerAdded = true;
			}
			this.map.fire('measure.on');
			this.isMeasure = true;
		}
	}

	measuringOff() {
		if (this.map) {
			this.map.getCanvas().style.cursor = '';
			this.map.off('click', this.mapClickListener.bind(this));
			this.map.fire('measure.off');
			this.isMeasure = false;
		}
	}

	clearFeatures() {
		if (this.map) {
			if (this.map.getLayer(LAYER_LINE)) this.map.removeLayer(LAYER_LINE);
			if (this.map.getLayer(LAYER_SYMBOL)) this.map.removeLayer(LAYER_SYMBOL);
			if (this.map.getSource(SOURCE_LINE)) this.map.removeSource(SOURCE_LINE);
			if (this.map.getSource(SOURCE_SYMBOL)) this.map.removeSource(SOURCE_SYMBOL);
		}
		this.measureControlData.markers.forEach((m) => m.remove());
		this.map.fire('measure.clear');
	}

	mapClickListener(event: MapMouseEvent) {
		if (!this.isMeasure) return;
		if (!this.map.getSource(SOURCE_LINE) || !this.map.getSource(SOURCE_SYMBOL)) {
			this.clearFeatures();
			this.initFeatures();
		}
		let zoom = this.map.getZoom();
		if (!zoom) {
			zoom = 15;
		}
		zoom = Math.round(zoom);
		const lnglat: number[] = [event.lngLat.lng, event.lngLat.lat];
		const tileSize: number = this.measureOption.tileSize ? this.measureOption.tileSize : 512;

		if (this.terrainRgbUrl) {
			const trgb = new TerrainRGB(this.terrainRgbUrl, tileSize);
			trgb.getElevation(lnglat, zoom).then((elev: number) => {
				if (!elev) elev = -1;
				this.addPoint(event.lngLat, elev);
			});
		} else {
			this.addPoint(event.lngLat);
		}
	}

	addPoint(lngLat: LngLat, elev?: number) {
		const marker = new Marker({
			draggable: true
		})
			.setLngLat(lngLat)
			.addTo(this.map);
		this.measureControlData.markers.push(marker);

		if (elev) {
			this.measureControlData.coordinates.push([lngLat.lng, lngLat.lat, elev]);
			this.measureControlData.elevations.push(elev);
		} else {
			this.measureControlData.coordinates.push([lngLat.lng, lngLat.lat]);
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.map
			.getSource(SOURCE_LINE)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			.setData(this.geoLineString(this.measureControlData.coordinates));
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.map.getSource(SOURCE_SYMBOL).setData(this.geoPoint(this.measureControlData.coordinates));

		this.map.fire('measure.add', {
			lnglat: lngLat,
			elevation: elev
		});
	}

	initFeatures() {
		this.measureControlData.markers = [];
		this.measureControlData.coordinates = [];
		this.measureControlData.elevations = [];
		if (this.map) {
			this.map.addSource(SOURCE_LINE, {
				type: 'geojson',
				data: this.geoLineString(this.measureControlData.coordinates)
			});
			this.map.addSource(SOURCE_SYMBOL, {
				type: 'geojson',
				data: this.geoPoint(this.measureControlData.coordinates)
			});
			this.map.addLayer({
				id: LAYER_LINE,
				type: 'line',
				source: SOURCE_LINE,
				paint: {
					'line-color': this.measureOption.mainColor,
					'line-width': 2
				}
			});
			this.map.addLayer({
				id: LAYER_SYMBOL,
				type: 'symbol',
				source: SOURCE_SYMBOL,
				layout: {
					'text-field': '{text}',
					'text-font': this.measureOption.font,
					'text-size': this.measureOption.fontSize,
					'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
					'text-radial-offset': 0.8,
					'text-justify': 'auto'
				},
				paint: {
					'text-color': this.measureOption.mainColor,
					'text-halo-color': this.measureOption.haloColor,
					'text-halo-width': this.measureOption.fontHalo
				}
			});
		}
	}

	labelFormat(length: number, elevation?: number) {
		let lengthLabel = `${length.toFixed(2)} km`;
		if (length < 1) {
			lengthLabel = `${(length * 1000).toFixed()} m`;
		}
		let elevLabel = '';
		if (elevation && elevation > 0) {
			elevLabel = `\nalt.${elevation}m`;
		}
		return `${lengthLabel}${elevLabel}`;
	}

	geoLineString(coordinates: number[][] = []): GeoJSONFeature {
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
	}

	geoPoint(coordinates: number[][] = []): GeoJSONFeature {
		let sum = 0;
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			type: 'FeatureCollection',
			features: coordinates.map((c, i) => {
				if (i > 0) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					sum += distance(coordinates[i - 1], coordinates[i], { units: this.units });
				}
				return {
					type: 'Feature',
					properties: {
						id: i + 1,
						text: this.labelFormat(sum, c[2]),
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
	}

	downloadGeoJSON() {
		if (this.measureControlData.coordinates.length === 0) return;
		const points = this.geoPoint(this.measureControlData.coordinates);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		points.features.forEach((f) => {
			delete f.properties.text;
		});
		if (this.measureControlData.coordinates.length > 1) {
			const line = this.geoLineString(this.measureControlData.coordinates);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			points.features.push(line);
		}
		const fileName = 'measure_result.geojson';
		const content = JSON.stringify(points);
		this.download(fileName, content);
	}

	download(fileName: string, content: string) {
		const blob = new Blob([content], { type: 'text/plain' });
		const aTag = document.createElement('a');
		aTag.href = URL.createObjectURL(blob);
		aTag.setAttribute('download', fileName);
		aTag.dispatchEvent(new MouseEvent('click'));
	}
}

export default MeasureManager;
