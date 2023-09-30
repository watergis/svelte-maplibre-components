<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import HeatmapGenerator from '$lib/editor-controls/heatmap/HeatmapGenerator.svelte';
	import LineBlur from '$lib/editor-controls/line/LineBlur.svelte';
	import LineDashArray from '$lib/editor-controls/line/LineDashArray.svelte';
	import LineWidth from '$lib/editor-controls/line/LineWidth.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { LayerSpecification } from 'maplibre-gl';

	export let layer: LayerSpecification;
</script>

<FieldControl title="Heatmap" help={{ layerType: 'heatmap' }}>
	<HeatmapGenerator bind:layer />
</FieldControl>

<FieldControl title="Opacity" help={{ type: 'paint', layerType: 'line', property: 'line-opacity' }}>
	<Opacity bind:layer />
</FieldControl>

<FieldControl
	title="Line color"
	help={{ type: 'paint', layerType: 'line', property: 'line-color' }}
>
	<ColorControl bind:layer propertyName="line-color" />
</FieldControl>

<FieldControl
	title="Line width"
	help={{ type: 'paint', layerType: 'line', property: 'line-width' }}
>
	<LineWidth bind:layer />
</FieldControl>

<FieldControl
	title="Line pattern"
	help={{ type: 'paint', layerType: 'line', property: 'line-dasharray' }}
>
	<LineDashArray bind:layer />
</FieldControl>

<FieldControl title="Line blur" help={{ type: 'paint', layerType: 'line', property: 'line-blur' }}>
	<LineBlur bind:layer />
</FieldControl>
