<script lang="ts">
	import Slider from '$lib/util/Slider.svelte';
	import type { Map, LayerSpecification } from 'maplibre-gl';

	export let map: Map;
	export let layer: LayerSpecification;

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'heatmap-intensity');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'heatmap-intensity', value);
	};
</script>

<Slider bind:value min={0} max={10} step={0.1} unit="" />
