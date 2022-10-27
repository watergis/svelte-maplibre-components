import type { MeasureControlData } from '$lib/types';
import { writable } from 'svelte/store';

export const measureControlData = writable<MeasureControlData>(null);
