<script lang="ts">
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import RangeSlider from 'svelte-range-slider-pips';

	export let map: Map;
	export let layer: LayerSpecification;

	const getOpacity = () => {
		const style = map?.getStyle().layers.find((l) => l.id === layer.id);
		let opacity;
		switch (style?.type) {
			case 'background':
				opacity = map.getPaintProperty(layer.id, 'background-opacity');
				break;
			case 'raster':
				opacity = map.getPaintProperty(layer.id, 'raster-opacity');
				break;
			case 'symbol':
				opacity = map.getPaintProperty(layer.id, 'icon-opacity');
				break;
			case 'line':
				opacity = map.getPaintProperty(layer.id, 'line-opacity');
				break;
			case 'fill':
				opacity = map.getPaintProperty(layer.id, 'fill-opacity');
				break;
			case 'circle':
				opacity = map.getPaintProperty(layer.id, 'circle-opacity');
				break;
			case 'heatmap':
				opacity = map.getPaintProperty(layer.id, 'heatmap-opacity');
				break;
			case 'fill-extrusion':
				opacity = map.getPaintProperty(layer.id, 'fill-extrusion-opacity');
				break;
			default:
				break;
		}
		if (!opacity) {
			opacity = 1;
		}
		return opacity as number;
	};

	let layerOpacity = getOpacity();
	let rangeSliderValues = [layerOpacity * 100];

	$: layerOpacity = rangeSliderValues[0] / 100;
	$: layerOpacity, setOpacity();

	const setOpacity = () => {
		const style = map?.getStyle().layers.find((l) => l.id === layer.id);
		switch (style?.type) {
			case 'background':
				map.setPaintProperty(layer.id, 'background-opacity', layerOpacity);
				break;
			case 'raster':
				map.setPaintProperty(layer.id, 'raster-opacity', layerOpacity);
				break;
			case 'symbol':
				map.setPaintProperty(layer.id, 'icon-opacity', layerOpacity);
				map.setPaintProperty(layer.id, 'text-opacity', layerOpacity);
				break;
			case 'line':
				map.setPaintProperty(layer.id, 'line-opacity', layerOpacity);
				break;
			case 'fill':
				map.setPaintProperty(layer.id, 'fill-opacity', layerOpacity);
				break;
			case 'circle':
				map.setPaintProperty(layer.id, 'circle-opacity', layerOpacity);
				break;
			case 'heatmap':
				map.setPaintProperty(layer.id, 'heatmap-opacity', layerOpacity);
				break;
			case 'fill-extrusion':
				map.setPaintProperty(layer.id, 'fill-extrusion-opacity', layerOpacity);
				break;
			default:
				break;
		}
	};
</script>

<div class="range-slider">
	<RangeSlider
		bind:values={rangeSliderValues}
		float={true}
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
