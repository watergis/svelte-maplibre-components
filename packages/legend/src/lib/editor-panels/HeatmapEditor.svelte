<script lang="ts">
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import HeatmapColor from '$lib/editor-controls/heatmap/HeatmapColor.svelte';
	import HeatmapIntensity from '$lib/editor-controls/heatmap/HeatmapIntensity.svelte';
	import HeatmapRadius from '$lib/editor-controls/heatmap/HeatmapRadius.svelte';
	import HeatmapWeight from '$lib/editor-controls/heatmap/HeatmapWeight.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-opacity' }}
>
	<Opacity />
</FieldControl>

<FieldControl
	title="Heatmap color"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-color' }}
>
	<HeatmapColor />
</FieldControl>

<FieldControl
	title="Heatmap intensity"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-intensity' }}
>
	<HeatmapIntensity />
</FieldControl>

<FieldControl
	title="Heatmap radius"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-radius' }}
>
	<HeatmapRadius />
</FieldControl>

<FieldControl
	title="Heatmap weight"
	help={{ type: 'paint', layerType: 'heatmap', property: 'heatmap-weight' }}
>
	<HeatmapWeight />
</FieldControl>
