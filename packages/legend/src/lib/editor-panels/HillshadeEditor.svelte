<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import HillshadeExaggeration from '$lib/editor-controls/HillshadeExaggeration.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<div class="field">
	<label class="label is-small">Hillshade exaggeration</label>
	<div class="control">
		<HillshadeExaggeration bind:map bind:layer />
	</div>
</div>
<div class="field">
	<label class="label is-small">Hillshade accent color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="hillshade-accent-color" />
	</div>
</div>
<div class="field">
	<label class="label is-small">Hillshade highlight color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="hillshade-highlight-color" />
	</div>
</div>
<div class="field">
	<label class="label is-small">Hillshade shadow color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="hillshade-shadow-color" />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
