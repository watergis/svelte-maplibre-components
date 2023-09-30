<script lang="ts">
	import Slider from '$lib/util/Slider.svelte';
	import { debounce } from 'lodash-es';
	import type { LayerSpecification } from 'maplibre-gl';

	import type { createMapStore } from '$lib/stores';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');

	export let layer: LayerSpecification;

	const getOpacity = () => {
		const style = $map?.getStyle().layers.find((l) => l.id === layer.id);
		let opacity;
		switch (style?.type) {
			case 'background':
				opacity = $map.getPaintProperty(layer.id, 'background-opacity');
				break;
			case 'raster':
				opacity = $map.getPaintProperty(layer.id, 'raster-opacity');
				break;
			case 'symbol':
				opacity = $map.getPaintProperty(layer.id, 'icon-opacity');
				break;
			case 'line':
				opacity = $map.getPaintProperty(layer.id, 'line-opacity');
				break;
			case 'fill':
				opacity = $map.getPaintProperty(layer.id, 'fill-opacity');
				break;
			case 'circle':
				opacity = $map.getPaintProperty(layer.id, 'circle-opacity');
				break;
			case 'heatmap':
				opacity = $map.getPaintProperty(layer.id, 'heatmap-opacity');
				break;
			case 'fill-extrusion':
				opacity = $map.getPaintProperty(layer.id, 'fill-extrusion-opacity');
				break;
			default:
				break;
		}

		if (!opacity) {
			opacity = 1;
		}
		return opacity as number;
	};

	let value = getOpacity();
	$: value, setOpacity();

	const setOpacity = debounce(() => {
		if (!value) return;
		const style = $map?.getStyle().layers.find((l) => l.id === layer.id);
		switch (style?.type) {
			case 'background':
				map.setPaintProperty(layer.id, 'background-opacity', value);
				break;
			case 'raster':
				map.setPaintProperty(layer.id, 'raster-opacity', value);
				break;
			case 'symbol':
				map.setPaintProperty(layer.id, 'icon-opacity', value);
				map.setPaintProperty(layer.id, 'text-opacity', value);
				break;
			case 'line':
				map.setPaintProperty(layer.id, 'line-opacity', value);
				break;
			case 'fill':
				map.setPaintProperty(layer.id, 'fill-opacity', value);
				break;
			case 'circle':
				map.setPaintProperty(layer.id, 'circle-opacity', value);
				break;
			case 'heatmap':
				map.setPaintProperty(layer.id, 'heatmap-opacity', value);
				break;
			case 'fill-extrusion':
				map.setPaintProperty(layer.id, 'fill-extrusion-opacity', value);
				break;
			default:
				break;
		}
	}, 100);
</script>

<Slider bind:value min={0} max={100} step={1} unit="%" />
