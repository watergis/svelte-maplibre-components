<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getLayoutProperty(layerId, 'text-rotate');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setLayoutProperty(layerId, 'text-rotate', value);
	};
</script>

<Slider bind:value min={0} max={359} step={1} unit="°" />
