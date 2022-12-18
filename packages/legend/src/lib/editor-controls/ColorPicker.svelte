<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
	import chroma from 'chroma-js';

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
		if (value && Array.isArray(value)) {
			if (value[0] === 'rgb') {
				value = chroma(value.splice(1, 3)).css();
			} else if (value[0] === 'rgba') {
				value = chroma(value.splice(1, 4)).css();
			}
		}

		if (!value) {
			value = '#000000';
		}

		return value as string;
	};

	let color: string = getValue();
	let rgba: RgbaColor;

	$: rgba, setMaplibreColor();
	const setMaplibreColor = () => {
		if (!rgba) return;
		color = chroma([rgba.r, rgba.g, rgba.b, rgba.a]).css();

		map.setPaintProperty(layer.id, propertyName, color);
		const newLayer = map.getStyle().layers.find((l) => l.id === layer.id);
		if (newLayer) {
			layer = newLayer;
		}
	};

	$: color, setPickerColor();
	const setPickerColor = () => {
		if (!color) return;
		const c = chroma(color);
		const rgb = c.rgb();
		rgba = { r: rgb[0], g: rgb[1], b: rgb[2], a: c.alpha() };
	};
</script>

<ColorPicker bind:rgb={rgba} label="Chose a color" isTextInput={false} isAlpha={true} />

<style lang="scss">
</style>
