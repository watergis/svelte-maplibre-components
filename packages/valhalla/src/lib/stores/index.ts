import type { ValhallaIsochrone } from '../ValhallaIsochrone';
import { writable } from 'svelte/store';
import { LngLat } from 'maplibre-gl';

export const valhallaControlData = writable<ValhallaIsochrone | undefined>(undefined);

export const valhallaRoutingData = writable<LngLat[]>(undefined);
