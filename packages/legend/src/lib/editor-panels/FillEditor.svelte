<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { LayerSpecification } from 'maplibre-gl';

	export let layer: LayerSpecification;
</script>

<FieldControl title="Opacity" help={{ type: 'paint', layerType: 'fill', property: 'fill-opacity' }}>
	<Opacity bind:layer />
</FieldControl>

<FieldControl
	title="Fill color"
	help={{ type: 'paint', layerType: 'fill', property: 'fill-color' }}
>
	<ColorControl bind:layer propertyName="fill-color" />
</FieldControl>

<FieldControl
	title="Fill outline color"
	help={{ type: 'paint', layerType: 'fill', property: 'fill-outline-color' }}
>
	<ColorControl bind:layer propertyName="fill-outline-color" />
</FieldControl>
