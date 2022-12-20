<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import CircleRadius from '$lib/editor-controls/CircleRadius.svelte';
	import CircleStrokeWidth from '$lib/editor-controls/CircleStrokeWidth.svelte';

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
	<label class="label is-small">Circle radius</label>
	<div class="control">
		<CircleRadius bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Circle color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="circle-color" />
	</div>
</div>

<div class="field">
	<label class="label is-small">Circle stroke width</label>
	<div class="control">
		<CircleStrokeWidth bind:map bind:layer />
	</div>
</div>

<div class="field">
	<label class="label is-small">Circle stroke color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="circle-stroke-color" />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
