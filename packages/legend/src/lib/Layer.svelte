<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Legend from './Legend.svelte';
	import type SpriteLoader from './sprite';
	import './style/fa/css/all.css';

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

<div class="layer-container">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span class="visible-button" on:click={() => (checked = !checked)}>
		{#if checked}
			<i class="fas fa-eye" />
		{:else}
			<i class="fas fa-eye-slash" />
		{/if}
	</span>
	<div class="legend"><Legend {map} {layer} {spriteLoader} /></div>
	<div class="layer-name">
		{relativeLayers && relativeLayers[layer.id] ? relativeLayers[layer.id] : layer.id}
	</div>
</div>

<style lang="scss">
	.layer-container {
		display: flex;
		align-items: center;
		justify-content: center;
		align-items: center;
		margin: 0;
		padding: 0;
		height: 2.5rem;

		.visible-button {
			padding-right: 0.5rem;
			cursor: pointer;
		}

		.legend {
			padding-right: 0.5rem;
		}

		.layer-name {
			font-family: system-ui, -apple-system, system-ui, 'Helvetica Neue', Helvetica, Arial,
				sans-serif;
			font-size: 16px;
			font-weight: 400;
		}
	}

	.fas:before {
		display: inline-block;
		text-decoration: none;
	}
</style>
