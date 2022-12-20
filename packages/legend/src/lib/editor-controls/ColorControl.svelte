<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import chroma from 'chroma-js';
	import ColorPicker from '$lib/util/ColorPicker.svelte';

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

	const getColorFromExpression = (value: any) => {
		if (value && Array.isArray(value)) {
			if (value[0] === 'rgb') {
				value = chroma(value.splice(1, 3)).css();
			} else if (value[0] === 'rgba') {
				value = chroma(value.splice(1, 4)).css();
			} else if (value[0] === 'match') {
				const values = value[value.length - 1];
				value = getColorFromExpression(values);
			}
		}
		return value;
	};

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, propertyName);
		value = getColorFromExpression(value);

		if (!value) {
			value = '#000000';
		}

		return value as string;
	};

	let color: string = getValue();

	const handleColorChanged = (e: { detail: { color: string } }) => {
		color = e.detail.color;
		map.setPaintProperty(layer.id, propertyName, color);
		const newLayer = map.getStyle().layers.find((l) => l.id === layer.id);
		if (newLayer) {
			layer = newLayer;
		}
	};
</script>

<ColorPicker bind:color on:change={handleColorChanged} />
