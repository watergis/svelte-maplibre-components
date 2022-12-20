<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import FillExtrusionHeight from '$lib/editor-controls/FillExtrusionHeight.svelte';
	import FillExtrusionBase from '$lib/editor-controls/FillExtrusionBase.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
</script>

<div class="field">
	<label class="label is-small">Opacity</label>
	<div class="control">
		<Opacity bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Fill extrusion color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="fill-extrusion-color" />
	</div>
</div>

<div class="field">
	<label class="label is-small">Fill extrusion height</label>
	<div class="control">
		<FillExtrusionHeight bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Fill extrusion base</label>
	<div class="control">
		<FillExtrusionBase bind:map bind:layer />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
