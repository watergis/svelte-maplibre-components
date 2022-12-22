<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import LineWidth from '$lib/editor-controls/LineWidth.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<FieldControl title="Opacity">
	<Opacity bind:map bind:layer />
</FieldControl>

<FieldControl title="Line color">
	<ColorControl bind:map bind:layer propertyName="line-color" />
</FieldControl>

<FieldControl title="Line width">
	<LineWidth bind:map bind:layer />
</FieldControl>
