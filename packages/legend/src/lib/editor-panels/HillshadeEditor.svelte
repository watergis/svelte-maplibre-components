<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import HillshadeExaggeration from '$lib/editor-controls/hillshade/HillshadeExaggeration.svelte';
	import HillshadeIlluminationDirection from '$lib/editor-controls/hillshade/HillshadeIlluminationDirection.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Hillshade exaggeration">
	<HillshadeExaggeration bind:map bind:layer />
</FieldControl>

<FieldControl title="Hillshade accent color">
	<ColorControl bind:map bind:layer propertyName="hillshade-accent-color" />
</FieldControl>

<FieldControl title="Hillshade highlight color">
	<ColorControl bind:map bind:layer propertyName="hillshade-highlight-color" />
</FieldControl>

<FieldControl title="Hillshade illumination direction">
	<HillshadeIlluminationDirection bind:map bind:layer />
</FieldControl>

<FieldControl title="Hillshade shadow color">
	<ColorControl bind:map bind:layer propertyName="hillshade-shadow-color" />
</FieldControl>
