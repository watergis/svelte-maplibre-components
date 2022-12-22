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

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;

	let iconImage = map.getLayoutProperty(layer.id, 'icon-image');
	let textField = map.getLayoutProperty(layer.id, 'text-field');
</script>

<FieldControl title="Opacity">
	<Opacity bind:map bind:layer />
</FieldControl>

{#if iconImage}
	<FieldControl title="Icon size">
		<IconSize bind:map bind:layer />
	</FieldControl>

	{#if spriteLoader?.isSdf(layer)}
		<FieldControl title="Icon color">
			<ColorControl bind:map bind:layer propertyName="icon-color" />
		</FieldControl>

		<FieldControl title="Icon halo color">
			<ColorControl bind:map bind:layer propertyName="icon-halo-color" />
		</FieldControl>

		<FieldControl title="Icon halo width">
			<IconHaloWidth bind:map bind:layer />
		</FieldControl>

		<FieldControl title="Icon halo blur">
			<IconHaloBlur bind:map bind:layer />
		</FieldControl>
	{/if}
{/if}

{#if textField}
	<FieldControl title="Text size">
		<TextSize bind:map bind:layer />
	</FieldControl>

	<FieldControl title="Text color">
		<ColorControl bind:map bind:layer propertyName="text-color" />
	</FieldControl>

	<FieldControl title="Text rotate">
		<TextRotate bind:map bind:layer />
	</FieldControl>

	<FieldControl title="Text halo color">
		<ColorControl bind:map bind:layer propertyName="text-halo-color" />
	</FieldControl>

	<FieldControl title="Text halo width">
		<TextHaloWidth bind:map bind:layer />
	</FieldControl>

	<FieldControl title="Text halo blur">
		<TextHaloBlur bind:map bind:layer />
	</FieldControl>
{/if}
