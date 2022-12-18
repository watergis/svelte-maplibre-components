<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import RangeSlider from 'svelte-range-slider-pips';

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
	let rangeSliderValues = [value * 100];

	$: value = rangeSliderValues[0] / 100;
	$: value, setOpacity();

	const setOpacity = () => {
		map?.setPaintProperty(layer.id, 'hillshade-exaggeration', value);
	};
</script>

<div class="range-slider">
	<RangeSlider
		bind:values={rangeSliderValues}
		float
		min={0}
		max={100}
		step={1}
		pips
		first="label"
		last="label"
		rest={false}
		suffix="%"
	/>
</div>

<style lang="scss">
	.range-slider {
		font-size: 12px;
	}
</style>
