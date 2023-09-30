<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'icon-halo-width');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'icon-halo-width', value);
	};
</script>

<Slider bind:value min={0} max={10} step={1} unit="px" />
