<script lang="ts">
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import RasterBrightnessMax from '$lib/editor-controls/raster/RasterBrightnessMax.svelte';
	import RasterBrightnessMin from '$lib/editor-controls/raster/RasterBrightnessMin.svelte';
	import RasterContrast from '$lib/editor-controls/raster/RasterContrast.svelte';
	import RasterHueRotate from '$lib/editor-controls/raster/RasterHueRotate.svelte';
	import RasterResampling from '$lib/editor-controls/raster/RasterResampling.svelte';
	import RasterSaturation from '$lib/editor-controls/raster/RasterSaturation.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { LayerSpecification } from 'maplibre-gl';

	export let layer: LayerSpecification;
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-opacity' }}
>
	<Opacity bind:layer />
</FieldControl>

<FieldControl
	title="Raster brightness max"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-brightness-max' }}
>
	<RasterBrightnessMax bind:layer />
</FieldControl>

<FieldControl
	title="Raster brightness min"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-brightness-min' }}
>
	<RasterBrightnessMin bind:layer />
</FieldControl>

<FieldControl
	title="Raster contrast"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-contrast' }}
>
	<RasterContrast bind:layer />
</FieldControl>

<FieldControl
	title="Raster hue rotate"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-hue-rotate' }}
>
	<RasterHueRotate bind:layer />
</FieldControl>

<FieldControl
	title="Raster resampling"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-resampling' }}
>
	<RasterResampling bind:layer />
</FieldControl>

<FieldControl
	title="Raster saturation"
	help={{ type: 'paint', layerType: 'raster', property: 'raster-saturation' }}
>
	<RasterSaturation bind:layer />
</FieldControl>
