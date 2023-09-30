<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FillExtrusionBase from '$lib/editor-controls/fill-extrusion/FillExtrusionBase.svelte';
	import FillExtrusionHeight from '$lib/editor-controls/fill-extrusion/FillExtrusionHeight.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-opacity' }}
>
	<Opacity />
</FieldControl>

<FieldControl
	title="Fill extrusion color"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-color' }}
>
	<ColorControl propertyName="fill-extrusion-color" />
</FieldControl>

<FieldControl
	title="Fill extrusion height"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-height' }}
>
	<FillExtrusionHeight />
</FieldControl>

<FieldControl
	title="Fill extrusion base"
	help={{ type: 'paint', layerType: 'fill-extrusion', property: 'fill-extrusion-base' }}
>
	<FillExtrusionBase />
</FieldControl>
