<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';

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
	<label class="label is-small">Line color</label>
	<div class="control">
		<ColorControl bind:map bind:layer propertyName="line-color" />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
