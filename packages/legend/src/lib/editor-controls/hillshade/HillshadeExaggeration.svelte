<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';
	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'hillshade-exaggeration');

		if (!value) {
			value = 0.5;
		}
		return value as number;
	};

	let value = getValue();
	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'hillshade-exaggeration', value);
	};
</script>

<Slider bind:value min={0} max={100} step={1} unit="%" />
