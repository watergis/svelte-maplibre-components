<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Legend from './Legend.svelte';
	import type SpriteLoader from './sprite';
	const dispatch = createEventDispatcher();

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	export let relativeLayers: { [key: string]: string } = {};
	let visibility = map.getLayer(layer.id).visibility;

	let checked = visibility === 'none' ? false : true;
	$: checked, setVisibility();

	const setVisibility = () => {
		const visibility = checked === true ? 'visible' : 'none';
		map.setLayoutProperty(layer.id, 'visibility', visibility);
		dispatch('visibilityChanged', {
			layer,
			visibility
		});
	};
</script>

<div class="columns is-vcentered is-mobile">
	<div class="column .is-marginless is-paddingless">
		<button class="button is-text is-narrow" on:click={() => (checked = !checked)}>
			<span class="icon is-small">
				{#if checked}
					<i class="fas fa-eye" />
				{:else}
					<i class="fas fa-eye-slash" />
				{/if}
			</span>
		</button>
	</div>
	<div class="column is-narrow .is-marginless is-paddingless">
		<Legend {map} {layer} {spriteLoader} />
	</div>
	<div class="column is-narrow .is-marginless pl-2 has-text-left">
		{relativeLayers && relativeLayers[layer.id] ? relativeLayers[layer.id] : layer.id}
	</div>
</div>

<style>
	@import './style/fa/css/all.css';

	.fas:before {
		display: inline-block;
		text-decoration: none;
	}
</style>
