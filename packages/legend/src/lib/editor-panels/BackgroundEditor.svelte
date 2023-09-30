<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { LayerSpecification } from 'maplibre-gl';

	export let layer: LayerSpecification;
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'background', property: 'background-opacity' }}
>
	<Opacity bind:layer />
</FieldControl>

<FieldControl
	title="Background color"
	help={{ type: 'paint', layerType: 'background', property: 'background-color' }}
>
	<ColorControl bind:layer propertyName="background-color" />
</FieldControl>
