<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import HeatmapIntensity from '$lib/editor-controls/heatmap/HeatmapIntensity.svelte';
	import HeatmapRadius from '$lib/editor-controls/heatmap/HeatmapRadius.svelte';
	import HeatmapWeight from '$lib/editor-controls/heatmap/HeatmapWeight.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Opacity">
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl title="Heatmap intensity">
	<HeatmapIntensity bind:map bind:layer />
</FieldControl>

<FieldControl title="Heatmap radius">
	<HeatmapRadius bind:map bind:layer />
</FieldControl>

<FieldControl title="Heatmap weight">
	<HeatmapWeight bind:map bind:layer />
</FieldControl>
