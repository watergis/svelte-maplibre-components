<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorPicker from '$lib/editor-controls/ColorPicker.svelte';

	export let map: Map;
	export let layer: LayerSpecification;

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
		<label class="label is-small">Icon color</label>
		<div class="control">
			<ColorPicker bind:map bind:layer propertyName="icon-color" />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Icon halo color</label>
		<div class="control">
			<ColorPicker bind:map bind:layer propertyName="icon-halo-color" />
		</div>
	</div>
{/if}

{#if textField}
	<div class="field">
		<label class="label is-small">Text color</label>
		<div class="control">
			<ColorPicker bind:map bind:layer propertyName="text-color" />
		</div>
	</div>
	<div class="field">
		<label class="label is-small">Text halo color</label>
		<div class="control">
			<ColorPicker bind:map bind:layer propertyName="text-halo-color" />
		</div>
	</div>
{/if}

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
