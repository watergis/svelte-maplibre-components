<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import Slider from '$lib/util/Slider.svelte';

	export let map: Map;
	export let layer: LayerSpecification;

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'hillshade-illumination-direction');

		if (!value) {
			value = 335;
		}
		return value as number;
	};

	let value = getValue();
	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'hillshade-illumination-direction', value);
	};
</script>

<Slider bind:value min={0} max={359} step={1} unit="degree" />
