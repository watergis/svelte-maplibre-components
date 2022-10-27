import type { Marker } from 'maplibre-gl';

export type MeasureControlData = {
	markers: Marker[];
	coordinates: number[][];
	elevations: number[];
};
