import type { LayerSpecification } from 'maplibre-gl';
import { writable } from 'svelte/store';

// map store for maplibre-gl object
export const invisibleLayerMap = writable<{ [key: string]: LayerSpecification }>({});
