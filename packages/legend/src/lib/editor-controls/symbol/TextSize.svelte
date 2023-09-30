<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getLayoutProperty(layerId, 'text-size');

		if (!value) {
			value = 16;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		if (!value) return;
		map.setLayoutProperty(layerId, 'text-size', value);
	};
</script>

<Slider bind:value min={0} max={64} step={0.1} unit="px" />
