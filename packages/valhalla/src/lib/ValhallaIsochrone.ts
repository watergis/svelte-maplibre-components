import type { GeoJSONFeature, Map, Marker as MapMarker } from 'maplibre-gl';
import pkg from 'maplibre-gl';
const { Marker } = pkg;

export enum ContourType {
	Time = 'time',
	Distance = 'distance'
}

export interface Contour {
	time?: number;
	distance?: number;
	color: string;
}

export interface IsochroneStyle {
	font: string[];
	fontSize: number;
	fontHalo: number;
	fontColor: string;
	fontHaloColor: string;
}

export interface ValhallaIsochroneOptions {
	Contours?: Contour[];
	isochrone?: IsochroneStyle;
}

export class ValhallaIsochrone {
	private map: Map;

	private url: string;

	private contourSources: string[] = [];

	private contourLayers: string[] = [];

	private contourMaker: MapMarker | undefined = undefined;

	private contours: Contour[] = [
		{
			time: 3,
			distance: 1,
			color: 'ff0000'
		},
		{
			time: 5,
			distance: 2,
			color: 'ffff00'
		},
		{
			time: 10,
			distance: 3,
			color: '0000ff'
		},
		{
			time: 15,
			distance: 4,
			color: 'ff00ff'
		}
	];

	private isochroneStyle: IsochroneStyle = {
		font: ['Roboto Bold'],
		fontSize: 16,
		fontHalo: 1,
		fontColor: '#000000',
		fontHaloColor: '#fff'
	};

	/**
	 * Constructor
	 * @param url URL for terrain RGB raster tilesets
	 */
	constructor(map: Map, url: string, contours?: Contour[], isochroneStyle?: IsochroneStyle) {
		this.map = map;
		this.url = url;
		if (contours) {
			this.contours = contours;
		}
		if (isochroneStyle) {
			this.isochroneStyle = Object.assign(this.isochroneStyle, isochroneStyle);
		}
	}

	clearFeatures() {
		if (this.contourLayers && this.contourLayers.length > 0) {
			this.contourLayers.forEach((id) => {
				this.map?.removeLayer(id);
			});
			this.contourLayers = [];
		}
		if (this.contourSources && this.contourSources.length > 0) {
			this.contourSources.forEach((id) => {
				this.map?.removeSource(id);
			});
			this.contourSources = [];
		}
		if (this.contourMaker) {
			this.contourMaker.remove();
			this.contourMaker = undefined;
		}
	}

	getIsochrone(
		lon: number,
		lat: number,
		contourType: ContourType,
		costing?: string,
		contours?: Contour[]
	): Promise<string | undefined> {
		this.clearFeatures();
		let contourList: Contour[] = JSON.parse(JSON.stringify(this.contours));
		if (contours) {
			contourList = contours;
		}
		contourList.forEach((c) => {
			if (contourType === ContourType.Time) {
				delete c.distance;
			} else {
				delete c.time;
			}
		});
		let unit = 'km';
		if (contourType === ContourType.Time) {
			unit = 'min';
		}

		return new Promise<string | undefined>(
			(resolve: (value?: string) => void, reject: (reason?: Error) => void) => {
				// http://localhost:8002/isochrone?json={%22locations%22:[{%22lat%22:-1.946357,%22lon%22:30.059753}],%22costing%22:%22pedestrian%22,%22contours%22:[{%22time%22:15,%22color%22:%22ff0000%22},{%22time%22:30,%22color%22:%22ffff00%22},{%22time%22:60,%22color%22:%220000ff%22}]}
				const jsonOption = {
					locations: [{ lat, lon }],
					costing,
					contours: contourList,
					polygons: true
				};
				const url = `${this.url}/isochrone?json=${JSON.stringify(jsonOption)}`;
				fetch(url)
					.then((res) => res.json())
					.then((geojson) => {
						geojson.features.forEach((f: GeoJSONFeature) => {
							const sourceName = `isochrone-${f.properties.contour}-${contourType}`;
							this.map?.addSource(sourceName, {
								type: 'geojson',
								data: f
							});
							this.contourSources.push(sourceName);
							this.map?.addLayer({
								id: `pg-${sourceName}-${contourType}`,
								type: 'fill',
								source: sourceName,
								layout: {},
								paint: {
									'fill-color': f.properties.fillColor,
									'fill-opacity': 0.1
								}
							});
							this.contourLayers.push(`pg-${sourceName}-${contourType}`);

							this.map?.addLayer({
								id: `ls-${sourceName}-${contourType}`,
								type: 'line',
								source: sourceName,
								layout: {
									'line-join': 'round',
									'line-cap': 'round'
								},
								paint: {
									'line-color': f.properties.fillColor,
									'line-width': 3
								}
							});
							this.contourLayers.push(`ls-${sourceName}-${contourType}`);

							this.map?.addLayer({
								id: `symbol-${sourceName}-${contourType}`,
								type: 'symbol',
								source: sourceName,
								layout: {
									'symbol-placement': 'line',
									'text-pitch-alignment': 'viewport',
									'text-font': this.isochroneStyle.font,
									'text-field': ['concat', ['get', 'contour'], ` ${unit}`],
									'text-size': this.isochroneStyle.fontSize
								},
								paint: {
									'text-color': this.isochroneStyle.fontColor,
									'text-halo-width': this.isochroneStyle.fontHalo,
									'text-halo-color': this.isochroneStyle.fontHaloColor
								}
							});
							this.contourLayers.push(`symbol-${sourceName}-${contourType}`);
						});
						if (this.map) {
							this.contourMaker = new Marker().setLngLat([lon, lat]).addTo(this.map);
						}
						resolve();
					})
					.catch((err) => reject(err));
			}
		);
	}

	public getContoursOption() {
		return this.contours;
	}
}
