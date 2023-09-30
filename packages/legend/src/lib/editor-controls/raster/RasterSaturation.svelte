<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import Slider from '$lib/util/Slider.svelte';
	import type { LayerSpecification } from 'maplibre-gl';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');

	export let layer: LayerSpecification;

	const getValue = () => {
		let value = $map.getPaintProperty(layer.id, 'raster-saturation');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layer.id, 'raster-saturation', value);
	};
</script>

<Slider bind:value min={-1} max={1} step={0.1} unit="" />
