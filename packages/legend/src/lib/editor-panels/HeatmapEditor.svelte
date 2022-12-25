<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import HeatmapIntensity from '$lib/editor-controls/heatmap/HeatmapIntensity.svelte';
	import HeatmapRadius from '$lib/editor-controls/heatmap/HeatmapRadius.svelte';
	import HeatmapWeight from '$lib/editor-controls/heatmap/HeatmapWeight.svelte';
	import HeatmapColor from '$lib/editor-controls/heatmap/HeatmapColor.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-opacity' }}
>
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Heatmap color"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-color' }}
>
	<HeatmapColor bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Heatmap intensity"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-intensity' }}
>
	<HeatmapIntensity bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Heatmap radius"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-radius' }}
>
	<HeatmapRadius bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Heatmap weight"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-weight' }}
>
	<HeatmapWeight bind:map bind:layer />
</FieldControl>
