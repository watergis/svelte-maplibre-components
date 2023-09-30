<script lang="ts">
	import Slider from '$lib/util/Slider.svelte';
	import type { LayerSpecification } from 'maplibre-gl';
	import { getContext } from 'svelte';
	import type { createMapStore } from './stores';

	let map: ReturnType<typeof createMapStore> = getContext('map');

	export let layer: LayerSpecification;

	const getValue = () => {
		let value = $map.getPaintProperty(layer.id, 'circle-radius');

		if (!value) {
			value = 5;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layer.id, 'circle-radius', value);
	};
</script>

<Slider bind:value min={0} max={20} step={1} unit="px" />
