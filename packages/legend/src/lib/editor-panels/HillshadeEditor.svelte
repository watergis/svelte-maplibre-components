<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import HillshadeExaggeration from '$lib/editor-controls/hillshade/HillshadeExaggeration.svelte';
	import HillshadeIlluminationDirection from '$lib/editor-controls/hillshade/HillshadeIlluminationDirection.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
</script>

<FieldControl
	title="Hillshade exaggeration"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-exaggeration' }}
>
	<HillshadeExaggeration />
</FieldControl>

<FieldControl
	title="Hillshade accent color"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-accent-color' }}
>
	<ColorControl propertyName="hillshade-accent-color" />
</FieldControl>

<FieldControl
	title="Hillshade highlight color"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-highlight-color' }}
>
	<ColorControl propertyName="hillshade-highlight-color" />
</FieldControl>

<FieldControl
	title="Hillshade illumination direction"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-illumination-direction' }}
>
	<HillshadeIlluminationDirection />
</FieldControl>

<FieldControl
	title="Hillshade shadow color"
	help={{ type: 'paint', layerType: 'hillshade', property: 'hillshade-shadow-color' }}
>
	<ColorControl propertyName="hillshade-shadow-color" />
</FieldControl>
