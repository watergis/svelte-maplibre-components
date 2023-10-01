<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';
	import { debounce } from 'lodash-es';
	import type { LayerSpecification } from 'maplibre-gl';

	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	const getOpacity = () => {
		const style = $map?.getStyle().layers.find((l: LayerSpecification) => l.id === layerId);
		let opacity;
		switch (style?.type) {
			case 'background':
				opacity = $map.getPaintProperty(layerId, 'background-opacity');
				break;
			case 'raster':
				opacity = $map.getPaintProperty(layerId, 'raster-opacity');
				break;
			case 'symbol':
				opacity = $map.getPaintProperty(layerId, 'icon-opacity');
				break;
			case 'line':
				opacity = $map.getPaintProperty(layerId, 'line-opacity');
				break;
			case 'fill':
				opacity = $map.getPaintProperty(layerId, 'fill-opacity');
				break;
			case 'circle':
				opacity = $map.getPaintProperty(layerId, 'circle-opacity');
				break;
			case 'heatmap':
				opacity = $map.getPaintProperty(layerId, 'heatmap-opacity');
				break;
			case 'fill-extrusion':
				opacity = $map.getPaintProperty(layerId, 'fill-extrusion-opacity');
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
		const style = $map?.getStyle().layers.find((l) => l.id === layerId);
		switch (style?.type) {
			case 'background':
				map.setPaintProperty(layerId, 'background-opacity', value);
				break;
			case 'raster':
				map.setPaintProperty(layerId, 'raster-opacity', value);
				break;
			case 'symbol':
				map.setPaintProperty(layerId, 'icon-opacity', value);
				map.setPaintProperty(layerId, 'text-opacity', value);
				break;
			case 'line':
				map.setPaintProperty(layerId, 'line-opacity', value);
				break;
			case 'fill':
				map.setPaintProperty(layerId, 'fill-opacity', value);
				break;
			case 'circle':
				map.setPaintProperty(layerId, 'circle-opacity', value);
				break;
			case 'heatmap':
				map.setPaintProperty(layerId, 'heatmap-opacity', value);
				break;
			case 'fill-extrusion':
				map.setPaintProperty(layerId, 'fill-extrusion-opacity', value);
				break;
			default:
				break;
		}
	}, 100);
</script>

<Slider bind:value min={0} max={100} step={1} unit="%" />
