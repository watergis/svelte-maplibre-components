<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import FillExtrusionHeight from '$lib/editor-controls/fill-extrusion/FillExtrusionHeight.svelte';
	import FillExtrusionBase from '$lib/editor-controls/fill-extrusion/FillExtrusionBase.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-opacity' }}
>
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Fill extrusion color"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-color' }}
>
	<ColorControl bind:map bind:layer propertyName="fill-extrusion-color" />
</FieldControl>

<FieldControl
	title="Fill extrusion height"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-height' }}
>
	<FillExtrusionHeight bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Fill extrusion base"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-base' }}
>
	<FillExtrusionBase bind:map bind:layer />
</FieldControl>
