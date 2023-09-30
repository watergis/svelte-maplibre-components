<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import HillshadeExaggeration from '$lib/editor-controls/hillshade/HillshadeExaggeration.svelte';
	import HillshadeIlluminationDirection from '$lib/editor-controls/hillshade/HillshadeIlluminationDirection.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { LayerSpecification } from 'maplibre-gl';

	export let layer: LayerSpecification;
</script>

<FieldControl
	title="Hillshade exaggeration"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-exaggeration' }}
>
	<HillshadeExaggeration bind:layer />
</FieldControl>

<FieldControl
	title="Hillshade accent color"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-accent-color' }}
>
	<ColorControl bind:layer propertyName="hillshade-accent-color" />
</FieldControl>

<FieldControl
	title="Hillshade highlight color"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-highlight-color' }}
>
	<ColorControl bind:layer propertyName="hillshade-highlight-color" />
</FieldControl>

<FieldControl
	title="Hillshade illumination direction"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-illumination-direction' }}
>
	<HillshadeIlluminationDirection bind:layer />
</FieldControl>

<FieldControl
	title="Hillshade shadow color"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-shadow-color' }}
>
	<ColorControl bind:layer propertyName="hillshade-shadow-color" />
</FieldControl>
