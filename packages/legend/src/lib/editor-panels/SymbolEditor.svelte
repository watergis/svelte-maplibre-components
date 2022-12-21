<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import type SpriteLoader from '$lib/sprite';
	import IconHaloWidth from '$lib/editor-controls/IconHaloWidth.svelte';
	import IconHaloBlur from '$lib/editor-controls/IconHaloBlur.svelte';
	import IconSize from '$lib/editor-controls/IconSize.svelte';
	import TextHaloWidth from '$lib/editor-controls/TextHaloWidth.svelte';
	import TextHaloBlur from '$lib/editor-controls/TextHaloBlur.svelte';
	import TextSize from '$lib/editor-controls/TextSize.svelte';
	import TextRotate from '$lib/editor-controls/TextRotate.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;

	let iconImage = map.getLayoutProperty(layer.id, 'icon-image');
	let textField = map.getLayoutProperty(layer.id, 'text-field');
</script>

<div class="field">
	<label class="label is-small">Opacity</label>
	<div class="control">
		<Opacity bind:map bind:layer />
	</div>
</div>

{#if iconImage}
	<div class="field">
		<label class="label is-small">Icon size</label>
		<div class="control">
			<IconSize bind:map bind:layer />
		</div>
	</div>
	{#if spriteLoader?.isSdf(layer)}
		<div class="field">
			<label class="label is-small">Icon color</label>
			<div class="control">
				<ColorControl bind:map bind:layer propertyName="icon-color" />
			</div>
		</div>
		<div class="field">
			<label class="label is-small">Icon halo color</label>
			<div class="control">
				<ColorControl bind:map bind:layer propertyName="icon-halo-color" />
			</div>
		</div>
		<div class="field">
			<label class="label is-small">Icon halo width</label>
			<div class="control">
				<IconHaloWidth bind:map bind:layer />
			</div>
		</div>
		<div class="field">
			<label class="label is-small">Icon halo blur</label>
			<div class="control">
				<IconHaloBlur bind:map bind:layer />
			</div>
		</div>
	{/if}
{/if}

{#if textField}
	<div class="field">
		<label class="label is-small">Text size</label>
		<div class="control">
			<TextSize bind:map bind:layer />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Text color</label>
		<div class="control">
			<ColorControl bind:map bind:layer propertyName="text-color" />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Text rotate</label>
		<div class="control">
			<TextRotate bind:map bind:layer />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Text halo color</label>
		<div class="control">
			<ColorControl bind:map bind:layer propertyName="text-halo-color" />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Text halo width</label>
		<div class="control">
			<TextHaloWidth bind:map bind:layer />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Text halo blur</label>
		<div class="control">
			<TextHaloBlur bind:map bind:layer />
		</div>
	</div>
{/if}

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
