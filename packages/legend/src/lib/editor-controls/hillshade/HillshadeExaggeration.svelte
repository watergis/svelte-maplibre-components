<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import Slider from '$lib/util/Slider.svelte';

	export let map: Map;
	export let layer: LayerSpecification;

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'hillshade-exaggeration');

		if (!value) {
			value = 0.5;
		}
		return value as number;
	};

	let value = getValue();
	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'hillshade-exaggeration', value);
	};
</script>

<Slider bind:value min={0} max={100} step={1} unit="%" />
