<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import CircleRadius from '$lib/editor-controls/circle/CircleRadius.svelte';
	import CircleStrokeWidth from '$lib/editor-controls/circle/CircleStrokeWidth.svelte';
	import HeatmapGenerator from '$lib/editor-controls/heatmap/HeatmapGenerator.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { LayerSpecification } from 'maplibre-gl';

	export let layer: LayerSpecification;
</script>

<FieldControl title="Heatmap" help={{ layerType: 'heatmap' }}>
	<HeatmapGenerator bind:layer />
</FieldControl>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'circle', property: 'circle-opacity' }}
>
	<Opacity bind:layer />
</FieldControl>

<FieldControl
	title="Circle radius"
	help={{ type: 'paint', layerType: 'circle', property: 'circle-radius' }}
>
	<CircleRadius bind:layer />
</FieldControl>

<FieldControl
	title="Circle color"
	help={{ type: 'paint', layerType: 'circle', property: 'circle-color' }}
>
	<ColorControl bind:layer propertyName="circle-color" />
</FieldControl>

<FieldControl
	title="Circle stroke width"
	help={{ type: 'paint', layerType: 'circle', property: 'circle-stroke-width' }}
>
	<CircleStrokeWidth bind:layer />
</FieldControl>

<FieldControl
	title="Circle stroke color"
	help={{ type: 'paint', layerType: 'circle', property: 'circle-stroke-color' }}
>
	<ColorControl bind:layer propertyName="circle-stroke-color" />
</FieldControl>
