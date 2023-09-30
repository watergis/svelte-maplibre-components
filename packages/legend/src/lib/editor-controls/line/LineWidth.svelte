<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'line-width');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		if (!value) return;
		map.setPaintProperty(layerId, 'line-width', value);
	};
</script>

<Slider bind:value min={0} max={20} step={1} unit="px" />
