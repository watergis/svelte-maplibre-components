<script lang="ts">
	import chroma from 'chroma-js';
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import { debounce } from 'lodash-es';
	import ColorPicker from '$lib/util/ColorPicker.svelte';

	export let map: Map;
	export let layer: LayerSpecification;

	type InterpolateType = number | string[] | string;

	let heatmapProperty: string;
	let colorRows: { color: string; value: string }[] = [];
	const START_POSITION = 3;

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'heatmap-color') as InterpolateType[];

		if (!value) {
			value = [
				'interpolate',
				['linear'],
				['heatmap-density'],
				0,
				'rgba(0, 0, 255, 0)',
				0.1,
				'royalblue',
				0.3,
				'cyan',
				0.5,
				'lime',
				0.7,
				'yellow',
				1,
				'red'
			];
		}

		if (value && value.length > 0 && value[0] !== 'interpolate') {
			throw Error('invalid color values');
		}

		const heatmapProperties = value[2] as string[];
		heatmapProperty = heatmapProperties[0].replace('-', ' ');

		colorRows = [];
		for (let i = START_POSITION; i < value.length - 1; i = i + 2) {
			const _value = value[i] as number;
			const _color = value[i + 1] as string;

			const c = chroma(_color);

			colorRows.push({
				color: c.css(),
				value: `${_value}`
			});
		}
		return value as InterpolateType[];
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'heatmap-color', value);
	};

	const handleColorChanged = debounce((index: number) => {
		const row = colorRows[index];
		value[START_POSITION + (index + 1) * 2 - 1] = row.color;
	}, 100);
</script>

<p class="description">Rendered by {heatmapProperty}</p>

<div class="color-table">
	{#each colorRows as row, index}
		<div class="row">
			<ColorPicker
				bind:color={row.color}
				bind:label={row.value}
				on:change={() => handleColorChanged(index)}
			/>
		</div>
	{/each}
</div>

<style lang="scss">
	.description {
		margin: 0;
		padding-bottom: 0.3rem;
		font-size: smaller;
	}
	.color-table {
		display: flex;
		flex-direction: column;

		.row {
			display: flex;
		}
	}
</style>
