<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import { debounce } from 'lodash-es';
	import ColorPicker from '$lib/util/ColorPicker.svelte';
	import { getColorFromExpression } from '$lib/util/getColorFromExpression';

	export let map: Map;
	export let layer: LayerSpecification;
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
		let value = map.getPaintProperty(layer.id, propertyName);
		value = getColorFromExpression(value);

		if (!value) {
			value = '#000000';
		}

		return value as string;
	};

	let color: string = getValue();

	const handleColorChanged = debounce((e: { detail: { color: string } }) => {
		color = e.detail.color;
		map.setPaintProperty(layer.id, propertyName, color);
		const newLayer = map.getStyle().layers.find((l) => l.id === layer.id);
		if (newLayer) {
			layer = newLayer;
		}
	}, 100);
</script>

<ColorPicker bind:color on:change={handleColorChanged} />
