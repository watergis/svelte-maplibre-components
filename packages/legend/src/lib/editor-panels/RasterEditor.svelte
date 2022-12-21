<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import RasterBrightnessMax from '$lib/editor-controls/RasterBrightnessMax.svelte';
	import RasterBrightnessMin from '$lib/editor-controls/RasterBrightnessMin.svelte';
	import RasterContrast from '$lib/editor-controls/RasterContrast.svelte';
	import RasterHueRotate from '$lib/editor-controls/RasterHueRotate.svelte';
	import RasterSaturation from '$lib/editor-controls/RasterSaturation.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<div class="field">
	<label class="label is-small">Opacity</label>
	<div class="control">
		<Opacity bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Raster brightness max</label>
	<div class="control">
		<RasterBrightnessMax bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Raster brightness min</label>
	<div class="control">
		<RasterBrightnessMin bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Raster contrast</label>
	<div class="control">
		<RasterContrast bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Raster hue rotate</label>
	<div class="control">
		<RasterHueRotate bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Raster saturation</label>
	<div class="control">
		<RasterSaturation bind:map bind:layer />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
