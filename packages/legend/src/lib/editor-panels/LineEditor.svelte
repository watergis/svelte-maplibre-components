<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import LineWidth from '$lib/editor-controls/line/LineWidth.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import LineBlur from '$lib/editor-controls/line/LineBlur.svelte';
	import LineDashArray from '$lib/editor-controls/line/LineDashArray.svelte';
	import HeatmapGenerator from '$lib/editor-controls/heatmap/HeatmapGenerator.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Heatmap" help={{ layerType: 'heatmap' }}>
	<HeatmapGenerator bind:map bind:layer />
</FieldControl>

<FieldControl title="Opacity" help={{ type: 'paint', layerType: 'line', property: 'line-opacity' }}>
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Line color"
	help={{ type: 'paint', layerType: 'line', property: 'line-color' }}
>
	<ColorControl bind:map bind:layer propertyName="line-color" />
</FieldControl>

<FieldControl
	title="Line width"
	help={{ type: 'paint', layerType: 'line', property: 'line-width' }}
>
	<LineWidth bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Line pattern"
	help={{ type: 'paint', layerType: 'line', property: 'line-dasharray' }}
>
	<LineDashArray bind:map bind:layer />
</FieldControl>

<FieldControl title="Line blur" help={{ type: 'paint', layerType: 'line', property: 'line-blur' }}>
	<LineBlur bind:map bind:layer />
</FieldControl>
