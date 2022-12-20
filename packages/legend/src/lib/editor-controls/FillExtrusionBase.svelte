<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import Slider from '$lib/util/Slider.svelte';

	export let map: Map;
	export let layer: LayerSpecification;

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'fill-extrusion-base');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = getValue();
	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'fill-extrusion-base', value);
	};
</script>

<Slider bind:value min={0} max={100} step={1} unit="m" />
