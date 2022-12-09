<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import { faEye, faEyeSlash, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
	import Legend from './Legend.svelte';
	import type SpriteLoader from './sprite';

	const dispatch = createEventDispatcher();

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	export let relativeLayers: { [key: string]: string } = {};
	export let enableLayerOrder = false;
	export let disableVisibleButton = false;
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

	const handleKeydownVisibility = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			setVisibility();
		}
	};

	const getLayerIndex = () => {
		const layers = map?.getStyle()?.layers;
		const index = layers?.findIndex((l) => l.id === layer.id);
		return index;
	};

	const checkIsFirstLayer = () => {
		const index = getLayerIndex();
		return index === 0;
	};

	const checkIsLastLayer = () => {
		const layers = map?.getStyle()?.layers;
		const index = getLayerIndex();
		return index === layers.length - 1;
	};

	let isFirstLater = checkIsFirstLayer();
	let isLastLayer = checkIsLastLayer();

	const moveBefore = () => {
		const currentIndex = getLayerIndex();
		const layers = map?.getStyle()?.layers;
		const beforeLayerId = layers[currentIndex - 1].id;
		map.moveLayer(layer.id, beforeLayerId);
		isFirstLater = checkIsFirstLayer();
		isLastLayer = checkIsLastLayer();
		dispatch('layerOrderChanged');
	};

	const handleKeydownMoveBefore = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			moveBefore();
		}
	};

	const moveAfter = () => {
		const currentIndex = getLayerIndex();
		const layers = map?.getStyle()?.layers;
		const afterLayerId = layers[currentIndex + 1].id;
		map.moveLayer(afterLayerId, layer.id);
		isFirstLater = checkIsFirstLayer();
		isLastLayer = checkIsLastLayer();
		dispatch('layerOrderChanged');
	};

	const handleKeydownmoveAfter = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			moveAfter();
		}
	};
</script>

<div class="layer-container" style={enableLayerOrder ? 'width:100%' : ''}>
	{#if !disableVisibleButton}
		<span
			tabindex="0"
			role="button"
			class="visible-button"
			on:click={() => (checked = !checked)}
			on:keydown={handleKeydownVisibility}
		>
			{#if checked}
				<Fa icon={faEye} />
			{:else}
				<Fa icon={faEyeSlash} />
			{/if}
		</span>
	{/if}
	<div class="legend"><Legend {map} {layer} {spriteLoader} /></div>
	<div class="layer-name">
		{relativeLayers && relativeLayers[layer.id] ? relativeLayers[layer.id] : layer.id}
	</div>
	{#if enableLayerOrder}
		<div class="layer-order">
			{#if !isFirstLater}
				<span
					tabindex="0"
					role="button"
					class="sort-button"
					on:click={moveBefore}
					on:keydown={handleKeydownMoveBefore}
				>
					<Fa icon={faSortUp} size="lg" />
				</span>
			{/if}
			{#if !isLastLayer}
				<span
					tabindex="0"
					role="button"
					class="sort-button"
					on:click={moveAfter}
					on:keydown={handleKeydownmoveAfter}
				>
					<Fa icon={faSortDown} size="lg" />
				</span>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.layer-container {
		display: flex;
		align-items: center;
		justify-content: center;
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

		.layer-order {
			display: flex;
			flex-direction: column;
			margin-left: auto;
			text-align: right;
			margin-bottom: 10px;
			padding-right: 0.5rem;

			.sort-button {
				cursor: pointer;
				height: 10px;
				width: 10px;
			}
		}
	}

	.fas:before {
		display: inline-block;
		text-decoration: none;
	}
</style>
