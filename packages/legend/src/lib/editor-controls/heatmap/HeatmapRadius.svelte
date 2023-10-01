<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'heatmap-radius');

		if (!value) {
			value = 30;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'heatmap-radius', value);
	};
</script>

<Slider bind:value min={1} max={100} step={1} unit="" />
