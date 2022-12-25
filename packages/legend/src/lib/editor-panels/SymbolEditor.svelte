<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import type SpriteLoader from '$lib/sprite';
	import IconHaloWidth from '$lib/editor-controls/symbol/IconHaloWidth.svelte';
	import IconHaloBlur from '$lib/editor-controls/symbol/IconHaloBlur.svelte';
	import IconSize from '$lib/editor-controls/symbol/IconSize.svelte';
	import TextHaloWidth from '$lib/editor-controls/symbol/TextHaloWidth.svelte';
	import TextHaloBlur from '$lib/editor-controls/symbol/TextHaloBlur.svelte';
	import TextSize from '$lib/editor-controls/symbol/TextSize.svelte';
	import TextRotate from '$lib/editor-controls/symbol/TextRotate.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import HeatmapGenerator from '$lib/editor-controls/heatmap/HeatmapGenerator.svelte';
	import IconOverlap from '$lib/editor-controls/symbol/IconOverlap.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;

	let iconImage = map.getLayoutProperty(layer.id, 'icon-image');
	let textField = map.getLayoutProperty(layer.id, 'text-field');
</script>

<FieldControl title="Heatmap" help={{ layerType: 'heatmap' }}>
	<HeatmapGenerator bind:map bind:layer />
</FieldControl>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'symbol', property: 'icon-opacity' }}
>
	<Opacity bind:map bind:layer />
</FieldControl>

{#if iconImage}
	<FieldControl
		title="Icon size"
		help={{ type: 'layout', layerType: 'symbol', property: 'icon-size' }}
	>
		<IconSize bind:map bind:layer />
	</FieldControl>

	<FieldControl
		title="Icon overlap"
		help={{ type: 'layout', layerType: 'symbol', property: 'icon-overlap' }}
	>
		<IconOverlap bind:map bind:layer />
	</FieldControl>

	{#if spriteLoader?.isSdf(layer)}
		<FieldControl
			title="Icon color"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-color' }}
		>
			<ColorControl bind:map bind:layer propertyName="icon-color" />
		</FieldControl>

		<FieldControl
			title="Icon halo color"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-halo-color' }}
		>
			<ColorControl bind:map bind:layer propertyName="icon-halo-color" />
		</FieldControl>

		<FieldControl
			title="Icon halo width"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-halo-width' }}
		>
			<IconHaloWidth bind:map bind:layer />
		</FieldControl>

		<FieldControl
			title="Icon halo blur"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-halo-blur' }}
		>
			<IconHaloBlur bind:map bind:layer />
		</FieldControl>
	{/if}
{/if}

{#if textField}
	<FieldControl
		title="Text size"
		help={{ type: 'layout', layerType: 'symbol', property: 'text-size' }}
	>
		<TextSize bind:map bind:layer />
	</FieldControl>

	<FieldControl
		title="Text color"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-color' }}
	>
		<ColorControl bind:map bind:layer propertyName="text-color" />
	</FieldControl>

	<FieldControl
		title="Text rotate"
		help={{ type: 'layout', layerType: 'symbol', property: 'text-rotate' }}
	>
		<TextRotate bind:map bind:layer />
	</FieldControl>

	<FieldControl
		title="Text halo color"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-halo-color' }}
	>
		<ColorControl bind:map bind:layer propertyName="text-halo-color" />
	</FieldControl>

	<FieldControl
		title="Text halo width"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-halo-width' }}
	>
		<TextHaloWidth bind:map bind:layer />
	</FieldControl>

	<FieldControl
		title="Text halo blur"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-halo-blur' }}
	>
		<TextHaloBlur bind:map bind:layer />
	</FieldControl>
{/if}
