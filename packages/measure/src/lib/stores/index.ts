import { writable } from 'svelte/store';
import MeasureManager from '../MeasureManager';

export const measureManager = writable<MeasureManager>(undefined);
