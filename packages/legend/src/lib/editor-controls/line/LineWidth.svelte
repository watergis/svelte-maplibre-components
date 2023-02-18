<script lang="ts">
	import Slider from '$lib/util/Slider.svelte';
	import type { Map, LayerSpecification } from 'maplibre-gl';

	export let map: Map;
	export let layer: LayerSpecification;

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'line-width');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		if (!value) return;
		map?.setPaintProperty(layer.id, 'line-width', value);
	};
</script>

<Slider bind:value min={0} max={20} step={1} unit="px" />
