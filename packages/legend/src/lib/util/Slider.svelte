<script lang="ts">
	import RangeSlider from 'svelte-range-slider-pips';

	export let value: number;
	export let min: number;
	export let max: number;
	export let unit: string;
	export let step = 1;
	let rangeSliderValues = unit === '%' ? [value * 100] : [value];

	$: rangeSliderValues, setValue();

	const setValue = () => {
		if (unit === '%') {
			value = rangeSliderValues[0] / 100;
		} else {
			value = rangeSliderValues[0];
		}
	};
</script>

<div class="range-slider">
	<RangeSlider
		bind:values={rangeSliderValues}
		float
		bind:min
		bind:max
		bind:step
		pips
		first="label"
		last="label"
		rest={false}
		suffix={unit}
	/>
</div>

<style lang="scss">
	.range-slider {
		font-size: 12px;
	}
</style>
