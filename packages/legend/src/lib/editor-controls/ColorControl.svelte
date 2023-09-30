<script lang="ts">
	import type { createMapStore } from '$lib/stores';
	import ColorPicker from '$lib/util/ColorPicker.svelte';
	import { getColorFromExpression } from '$lib/util/getColorFromExpression';
	import { debounce } from 'lodash-es';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');
	let layerId: string = getContext('layerId');

	export let propertyName:
		| 'background-color'
		| 'fill-color'
		| 'fill-outline-color'
		| 'line-color'
		| 'icon-color'
		| 'icon-halo-color'
		| 'text-color'
		| 'text-halo-color'
		| 'circle-color'
		| 'circle-stroke-color'
		| 'fill-extrusion-color'
		| 'hillshade-accent-color'
		| 'hillshade-highlight-color'
		| 'hillshade-shadow-color';

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, propertyName);
		value = getColorFromExpression(value);

		if (!value) {
			value = '#000000';
		}

		if (value && typeof value === 'object') {
			if ('stops' in value) {
				const expr = value as { base: number; stops: [number, string][] };
				const stops = expr.stops as [number, string][];
				stops.forEach((stop) => {
					stop[1] = getColorFromExpression(stop[1]) as string;
				});
				return expr;
			}
		}

		return value as string;
	};

	let color: string | { base: number; stops: [number, string][] } = getValue();

	const handleColorChanged = debounce((e: { detail: { color: string } }) => {
		if (typeof color === 'string') {
			color = e.detail.color;
			map.setPaintProperty(layerId, propertyName, color);
		} else {
			map.setPaintProperty(layerId, propertyName, color);
		}
	}, 100);
</script>

{#if typeof color === 'string'}
	<ColorPicker bind:color on:change={handleColorChanged} />
{:else if 'stops' in color}
	{#each color.stops as stop}
		<div class="stop">
			<p>{stop[0]}</p>
			<ColorPicker bind:color={stop[1]} on:change={handleColorChanged} />
		</div>
	{/each}
{/if}

<style lang="scss">
	.stop {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1px;
	}
</style>
