<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import Slider from '$lib/util/Slider.svelte';
	import type { LayerSpecification } from 'maplibre-gl';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');

	export let layer: LayerSpecification;

	const getValue = () => {
		let value = $map.getLayoutProperty(layer.id, 'text-rotate');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setLayoutProperty(layer.id, 'text-rotate', value);
	};
</script>

<Slider bind:value min={0} max={359} step={1} unit="°" />
