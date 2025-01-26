<script lang="ts">
	import { debounce } from 'lodash-es';
	import RangeSlider from 'svelte-range-slider-pips';

	interface Props {
		value: number;
		min: number;
		max: number;
		unit: string;
		step?: number;
		onchange?: (value: number) => void;
	}

	let {
		value = $bindable(),
		min = $bindable(),
		max = $bindable(),
		unit = $bindable(),
		step = $bindable(1),
		onchange = () => {}
	}: Props = $props();
	let rangeSliderValues = $state(unit === '%' ? [value * 100] : [value]);

	const setValue = debounce(() => {
		if (unit === '%') {
			value = rangeSliderValues[0] / 100;
		} else {
			value = rangeSliderValues[0];
		}
		if (onchange) onchange(value);
	}, 300);
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
		on:change={setValue}
	/>
</div>

<style lang="scss">
	.range-slider {
		font-size: 12px;
	}
</style>
