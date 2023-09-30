<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import Slider from '$lib/util/Slider.svelte';
	import type { LayerSpecification } from 'maplibre-gl';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');

	export let layer: LayerSpecification;

	const getValue = () => {
		let value = $map.getLayoutProperty(layer.id, 'text-size');

		if (!value) {
			value = 16;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		if (!value) return;
		map.setLayoutProperty(layer.id, 'text-size', value);
	};
</script>

<Slider bind:value min={0} max={64} step={0.1} unit="px" />
