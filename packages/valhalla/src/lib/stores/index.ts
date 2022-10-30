import type { ValhallaIsochrone } from '../ValhallaIsochrone';
import type { ValhallaRouting } from '../ValhallaRouting';
import { writable } from 'svelte/store';

export const valhallaControlData = writable<ValhallaIsochrone | undefined>(undefined);
export const valhallaRoutingData = writable<ValhallaRouting | undefined>(undefined);
