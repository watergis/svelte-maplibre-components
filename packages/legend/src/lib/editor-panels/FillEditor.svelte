<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Opacity" help={{ type: 'paint', layerType: 'fill', property: 'fill-opacity' }}>
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Fill color"
	help={{ type: 'paint', layerType: 'fill', property: 'fill-color' }}
>
	<ColorControl bind:map bind:layer propertyName="fill-color" />
</FieldControl>

<FieldControl
	title="Fill outline color"
	help={{ type: 'paint', layerType: 'fill', property: 'fill-outline-color' }}
>
	<ColorControl bind:map bind:layer propertyName="fill-outline-color" />
</FieldControl>
