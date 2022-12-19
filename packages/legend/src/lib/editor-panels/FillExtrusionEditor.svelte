<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorPicker from '$lib/editor-controls/ColorPicker.svelte';

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
		<ColorPicker bind:map bind:layer propertyName="fill-extrusion-color" />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
