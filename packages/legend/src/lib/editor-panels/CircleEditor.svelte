<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import CircleRadius from '$lib/editor-controls/CircleRadius.svelte';
	import CircleStrokeWidth from '$lib/editor-controls/CircleStrokeWidth.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Opacity">
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl title="Circle radius">
	<CircleRadius bind:map bind:layer />
</FieldControl>

<FieldControl title="Circle color">
	<ColorControl bind:map bind:layer propertyName="circle-color" />
</FieldControl>

<FieldControl title="Circle stroke width">
	<CircleStrokeWidth bind:map bind:layer />
</FieldControl>

<FieldControl title="Circle stroke color">
	<ColorControl bind:map bind:layer propertyName="circle-stroke-color" />
</FieldControl>
