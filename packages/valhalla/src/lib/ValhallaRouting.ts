import { GeoJSONFeature, LngLat, Map, MapMouseEvent } from 'maplibre-gl';

const SOURCE_LINE = 'routing-controls-source-line';
const LAYER_LINE = 'routing-controls-layer-line';
const LAYER_LINE_LABEL = 'routing-controls-layer-line-label';
const LAYER_SYMBOL = 'routing-controls-layer-symbol';
const SOURCE_SYMBOL = 'routing-controls-source-symbol';

export interface ValhallaTripSummary {
	has_time_restrictions: boolean;
	min_lat: number;
	min_lon: number;
	max_lat: number;
	max_lon: number;
	time: number;
	length: number;
	cost: number;
}

export interface ValhallaRoutingLocation {
	type: string;
	lat: number;
	lon: number;
	city: string;
	original_index: number;
}

export interface ValhallaRoutingLeg {
	maneuvers: {
		type: number;
		instruction: string;
		verbal_pre_transition_instruction: string;
		verbal_post_transition_instruction: string;
		time: number;
		length: number;
		cost: number;
		begin_shape_index: number;
		end_shape_index: number;
		rough: boolean;
		travel_mode: string;
		travel_type: string;
	}[];
	summary: ValhallaTripSummary;
	shape: string;
}

export interface ValhallaTripResult {
	trip: {
		locations: ValhallaRoutingLocation[];
		legs: ValhallaRoutingLeg[];
		summary: ValhallaTripSummary;
		status_message: string;
		status: number;
		units: string;
		language: string;
	};
	id: string;
}

export interface ValhallaError {
	error: string;
	error_code: number;
	status: string;
	status_code: number;
}

export interface ValhallaRoutingOptions {
	font: string[];
	fontSize: number;
	fontHalo: number;
	fontColor: string;
	fontHaloColor: string;
	iconImage: string;
	iconSize: number;
}

export class ValhallaRouting {
	private map: Map;

	private tripData: LngLat[] = [];

	public getTripData(): LngLat[] {
		return this.tripData;
	}

	private url: string;

	private options: ValhallaRoutingOptions = {
		font: ['Roboto Medium'],
		fontSize: 14,
		fontHalo: 3,
		fontColor: '#263238',
		fontHaloColor: '#fff',
		iconImage: 'marker',
		iconSize: 1
	};

	private tripSummary: ValhallaTripSummary | undefined;
	public getTripSummary(): ValhallaTripSummary | undefined {
		return this.tripSummary;
	}

	private isRouting = false;
	private isClickListenerAdded = false;

	/**
	 * Constructor
	 * @param url URL for terrain RGB raster tilesets
	 */
	constructor(map: Map, url: string, options?: ValhallaRoutingOptions) {
		this.map = map;
		this.url = url;
		if (options) {
			this.options = Object.assign(this.options, options);
		}
	}

	clearFeatures() {
		if (this.map) {
			if (this.map.getLayer(LAYER_LINE)) this.map.removeLayer(LAYER_LINE);
			if (this.map.getLayer(LAYER_LINE_LABEL)) this.map.removeLayer(LAYER_LINE_LABEL);
			if (this.map.getLayer(LAYER_SYMBOL)) this.map.removeLayer(LAYER_SYMBOL);
			if (this.map.getSource(SOURCE_LINE)) this.map.removeSource(SOURCE_LINE);
			if (this.map.getSource(SOURCE_SYMBOL)) this.map.removeSource(SOURCE_SYMBOL);
		}
		this.tripData = [];
		this.tripSummary = undefined;
		this.map.fire('routing.clear');
	}

	addingPointOn() {
		this.map.getCanvas().style.cursor = 'crosshair';
		if (!this.isClickListenerAdded) {
			this.map.on('click', this.mapClickListener.bind(this));
			this.isClickListenerAdded = true;
		}
		this.map.fire('routing.on');
		this.isRouting = true;
	}

	addingPointOff() {
		this.map.getCanvas().style.cursor = '';
		this.map.off('click', this.mapClickListener.bind(this));
		this.map.fire('routing.off');
		this.isRouting = false;
	}

	mapClickListener(event: MapMouseEvent) {
		if (!this.isRouting) return;
		const lnglat = event.lngLat;
		if (!this.tripData) this.tripData = [];
		this.tripData = [...this.tripData, lnglat];
		this.map.fire('routing.point.added');
	}

	calcRoute(meansOfTransport: string): void {
		if (!this.tripData || (this.tripData && this.tripData.length < 2)) {
			this.tripSummary = undefined;
			return;
		}
		this.map.fire('routing.error', { message: '' });
		// errorMessage = '';
		const baseAPI = `${this.url}/route`;
		const params = {
			locations: this.tripData.map((pt) => {
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
					this.tripData.pop(); //remove the last coordinates which cause error
					throw new Error(
						`${json.status} (${json.status_code}): ${json.error} (${json.error_code})`
					);
				}
				const shapes = json.trip.legs.map((s) => this.decodeShape(s.shape));
				let shape: number[][] = [];
				shapes.forEach((shp) => {
					shape = [...shape, ...shp];
				});
				this.tripSummary = json.trip.summary;
				this.tripSummary.length = Number(this.tripSummary.length.toFixed(2));
				this.tripSummary.time = Number((this.tripSummary.time / 60).toFixed());

				const features = {
					type: 'FeatureCollection',
					features: json.trip.legs.map((leg) => {
						const shape = this.decodeShape(leg.shape);
						const props = {
							length: Number(leg.summary.length.toFixed(2)),
							time: Number((leg.summary.time / 60).toFixed())
						};
						return this.geoLineString(shape, props);
					})
				};

				const pointFeatures = this.geoPoint(this.tripData.map((pt) => [pt.lng, pt.lat]));

				this.map.fire('routing.calc.done');

				if (this.map) {
					if (!this.map.getSource(SOURCE_LINE)) {
						this.map.addSource(SOURCE_LINE, {
							type: 'geojson',
							data: features
						});
						this.map.addSource(SOURCE_SYMBOL, {
							type: 'geojson',
							data: pointFeatures
						});
						this.map.addLayer({
							id: LAYER_LINE,
							type: 'line',
							source: SOURCE_LINE,
							paint: {
								'line-color': 'rgb(255,0,0)',
								'line-width': 4
							}
						});

						this.map.addLayer({
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
								'text-font': this.options.font,
								'text-size': this.options.fontSize,
								'symbol-placement': 'line',
								'text-allow-overlap': true,
								'text-ignore-placement': true
							},
							paint: {
								'text-color': this.options.fontColor,
								'text-halo-color': this.options.fontHaloColor,
								'text-halo-width': this.options.fontHalo
							}
						});

						this.map.addLayer({
							id: LAYER_SYMBOL,
							type: 'symbol',
							source: SOURCE_SYMBOL,
							layout: {
								'icon-image': this.options.iconImage,
								'icon-size': this.options.iconSize,
								'text-field': ['get', 'text'],
								'text-font': this.options.font,
								'text-size': this.options.fontSize,
								'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
								'text-radial-offset': 0.8,
								'text-justify': 'auto'
							},
							paint: {
								'text-color': this.options.fontColor,
								'text-halo-color': this.options.fontHaloColor,
								'text-halo-width': this.options.fontHalo
							}
						});
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						this.map.getSource(SOURCE_LINE).setData(features);
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						this.map.getSource(SOURCE_SYMBOL).setData(pointFeatures);
					}
				}
			})
			.catch((err: ErrorEvent) => {
				console.error(err);
				this.map.fire('routing.error', { message: err.message });
			});
	}

	geoLineString(
		coordinates: number[][] = [],
		props: { [key: string]: string | number } = {}
	): GeoJSONFeature {
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
	}

	geoPoint(coordinates: number[][] = []): GeoJSONFeature {
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
	}

	private decodeShape(value: string, precision = 6) {
		let index = 0,
			lat = 0,
			lng = 0,
			// eslint-disable-next-line prefer-const
			coordinates: number[][] = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			// eslint-disable-next-line prefer-const
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
	}
}
