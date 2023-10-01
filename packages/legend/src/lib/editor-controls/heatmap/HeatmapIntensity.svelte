<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'heatmap-intensity');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'heatmap-intensity', value);
	};
</script>

<Slider bind:value min={0} max={10} step={0.1} unit="" />
