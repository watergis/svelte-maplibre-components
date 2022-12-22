<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import RasterBrightnessMax from '$lib/editor-controls/RasterBrightnessMax.svelte';
	import RasterBrightnessMin from '$lib/editor-controls/RasterBrightnessMin.svelte';
	import RasterContrast from '$lib/editor-controls/RasterContrast.svelte';
	import RasterHueRotate from '$lib/editor-controls/RasterHueRotate.svelte';
	import RasterSaturation from '$lib/editor-controls/RasterSaturation.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Opacity">
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl title="Raster brightness max">
	<RasterBrightnessMax bind:map bind:layer />
</FieldControl>

<FieldControl title="Raster brightness min">
	<RasterBrightnessMin bind:map bind:layer />
</FieldControl>

<FieldControl title="Raster contrast">
	<RasterContrast bind:map bind:layer />
</FieldControl>

<FieldControl title="Raster hue rotate">
	<RasterHueRotate bind:map bind:layer />
</FieldControl>

<FieldControl title="Raster saturation">
	<RasterSaturation bind:map bind:layer />
</FieldControl>
