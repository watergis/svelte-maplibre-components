<script lang="ts">
	import Slider from '$lib/util/Slider.svelte';
	import type { Map, LayerSpecification } from 'maplibre-gl';

	export let map: Map;
	export let layer: LayerSpecification;

	const getValue = () => {
		let value = map.getLayoutProperty(layer.id, 'icon-size');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		if (!value) return;
		map?.setLayoutProperty(layer.id, 'icon-size', value);
	};
</script>

<Slider bind:value min={0} max={10} step={0.1} unit="px" />
