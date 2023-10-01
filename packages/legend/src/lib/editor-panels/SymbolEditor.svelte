<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import HeatmapGenerator from '$lib/editor-controls/heatmap/HeatmapGenerator.svelte';
	import IconHaloBlur from '$lib/editor-controls/symbol/IconHaloBlur.svelte';
	import IconHaloWidth from '$lib/editor-controls/symbol/IconHaloWidth.svelte';
	import IconOverlap from '$lib/editor-controls/symbol/IconOverlap.svelte';
	import IconSize from '$lib/editor-controls/symbol/IconSize.svelte';
	import TextHaloBlur from '$lib/editor-controls/symbol/TextHaloBlur.svelte';
	import TextHaloWidth from '$lib/editor-controls/symbol/TextHaloWidth.svelte';
	import TextRotate from '$lib/editor-controls/symbol/TextRotate.svelte';
	import TextSize from '$lib/editor-controls/symbol/TextSize.svelte';
	import type SpriteLoader from '$lib/sprite';
	import FieldControl from '$lib/util/FieldControl.svelte';
	import type { SymbolLayerSpecification } from 'maplibre-gl';
	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	let layer: SymbolLayerSpecification = $map.getStyle().layers.find((l) => {
		l.id === layerId;
	}) as SymbolLayerSpecification;
	export let spriteLoader: SpriteLoader;

	let iconImage = $map.getLayoutProperty(layerId, 'icon-image');
	let textField = $map.getLayoutProperty(layerId, 'text-field');
</script>

<FieldControl title="Heatmap" help={{ layerType: 'heatmap' }}>
	<HeatmapGenerator />
</FieldControl>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'symbol', property: 'icon-opacity' }}
>
	<Opacity />
</FieldControl>

{#if iconImage}
	<FieldControl
		title="Icon size"
		help={{ type: 'layout', layerType: 'symbol', property: 'icon-size' }}
	>
		<IconSize />
	</FieldControl>

	<FieldControl
		title="Icon overlap"
		help={{ type: 'layout', layerType: 'symbol', property: 'icon-overlap' }}
	>
		<IconOverlap />
	</FieldControl>

	{#if layer && spriteLoader?.isSdf(layer)}
		<FieldControl
			title="Icon color"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-color' }}
		>
			<ColorControl propertyName="icon-color" />
		</FieldControl>

		<FieldControl
			title="Icon halo color"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-halo-color' }}
		>
			<ColorControl propertyName="icon-halo-color" />
		</FieldControl>

		<FieldControl
			title="Icon halo width"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-halo-width' }}
		>
			<IconHaloWidth />
		</FieldControl>

		<FieldControl
			title="Icon halo blur"
			help={{ type: 'paint', layerType: 'symbol', property: 'icon-halo-blur' }}
		>
			<IconHaloBlur />
		</FieldControl>
	{/if}
{/if}

{#if textField}
	<FieldControl
		title="Text size"
		help={{ type: 'layout', layerType: 'symbol', property: 'text-size' }}
	>
		<TextSize />
	</FieldControl>

	<FieldControl
		title="Text color"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-color' }}
	>
		<ColorControl propertyName="text-color" />
	</FieldControl>

	<FieldControl
		title="Text rotate"
		help={{ type: 'layout', layerType: 'symbol', property: 'text-rotate' }}
	>
		<TextRotate />
	</FieldControl>

	<FieldControl
		title="Text halo color"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-halo-color' }}
	>
		<ColorControl propertyName="text-halo-color" />
	</FieldControl>

	<FieldControl
		title="Text halo width"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-halo-width' }}
	>
		<TextHaloWidth />
	</FieldControl>

	<FieldControl
		title="Text halo blur"
		help={{ type: 'paint', layerType: 'symbol', property: 'text-halo-blur' }}
	>
		<TextHaloBlur />
	</FieldControl>
{/if}
