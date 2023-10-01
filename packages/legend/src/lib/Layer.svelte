<script context="module" lang="ts">
	import { getContext, setContext } from 'svelte';

	const LAYERID_CONTEXT_KEY = 'maplibre-legend-layer-id';

	export const getLayerIdContext = () => {
		const layerId: string = getContext(LAYERID_CONTEXT_KEY);
		return layerId;
	};

	export const setLayerIdContext = (layerId: string) => {
		setContext(LAYERID_CONTEXT_KEY, layerId);
	};
</script>

<script lang="ts">
	import {
		faEye,
		faEyeSlash,
		faGripVertical,
		faSortDown,
		faSortUp
	} from '@fortawesome/free-solid-svg-icons';
	import { isMobile } from 'detect-touch-device';
	import type { LayerSpecification } from 'maplibre-gl';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	import Legend from './Legend.svelte';
	import { getMapContext } from './LegendPanel.svelte';
	import StyleEditor from './StyleEditor.svelte';
	import type SpriteLoader from './sprite';
	import { clean } from './util/clean';

	const dispatch = createEventDispatcher();

	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	export let relativeLayers: { [key: string]: string } = {};
	export let enableLayerOrder = false;
	export let disableVisibleButton = false;
	export let enableEditing = true;
	export let selectedFormat: 'yaml' | 'json';

	const mapStore = getMapContext();
	setLayerIdContext(layer.id);

	let visibility = $mapStore?.getLayer(layer.id).visibility;

	let checked = visibility === 'none' ? false : true;
	$: checked, setVisibility();

	$: layerTitle =
		relativeLayers && relativeLayers[layer.id] ? relativeLayers[layer.id] : clean(layer.id);

	const setVisibility = () => {
		const visibility = checked === true ? 'visible' : 'none';
		mapStore.setLayoutProperty(layer.id, 'visibility', visibility);
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
		const layers = $mapStore?.getStyle()?.layers;
		const index = layers?.findIndex((l) => l.id === layer.id);
		return index;
	};

	const getTotalCount = () => {
		return $mapStore?.getStyle()?.layers.length;
	};

	const checkIsFirstLayer = () => {
		const index = getLayerIndex();
		return index === 0;
	};

	const checkIsLastLayer = () => {
		const layers = $mapStore?.getStyle()?.layers;
		const index = getLayerIndex();
		return index === layers.length - 1;
	};

	let isFirstLater = checkIsFirstLayer();
	let isLastLayer = checkIsLastLayer();

	const moveBefore = () => {
		const currentIndex = getLayerIndex();
		const layers = $mapStore?.getStyle()?.layers;
		const beforeLayerId = layers[currentIndex - 1].id;
		$mapStore.moveLayer(layer.id, beforeLayerId);
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
		const layers = $mapStore?.getStyle()?.layers;
		const afterLayerId = layers[currentIndex + 1].id;
		$mapStore.moveLayer(afterLayerId, layer.id);
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

<div class="layer-container" style="cursor:{enableLayerOrder ? 'grab' : 'default'};">
	{#if enableLayerOrder}
		<div
			class="draggable-icon has-tooltip-right has-tooltip-arrow"
			data-tooltip="{isMobile ? 'Long press & drag' : 'Drag'} to change order"
		>
			<Fa icon={faGripVertical} />
		</div>
	{/if}
	{#if !disableVisibleButton}
		{#if !enableLayerOrder}
			<div
				tabindex="0"
				role="button"
				class="visible-button has-tooltip-right has-tooltip-arrow"
				data-tooltip="{checked ? 'Hide' : 'Show'} layer"
				on:click={() => (checked = !checked)}
				on:keydown={handleKeydownVisibility}
			>
				{#if checked}
					<Fa icon={faEye} />
				{:else}
					<Fa icon={faEyeSlash} />
				{/if}
			</div>
		{/if}
	{/if}
	<div class="legend">
		{#if $mapStore}
			<Legend {spriteLoader} />
		{/if}
	</div>
	<div class="layer-name">
		{layerTitle}
	</div>
	{#if enableLayerOrder}
		<div class="layer-position">
			{getLayerIndex() + 1}/{getTotalCount()}
		</div>
		<div class="layer-order">
			{#if !isFirstLater}
				<span
					tabindex="0"
					role="button"
					class="sort-button has-tooltip-left has-tooltip-arrow"
					data-tooltip="Bring backward in map"
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
					class="sort-button has-tooltip-left has-tooltip-arrow"
					data-tooltip="Bring forward in map"
					on:click={moveAfter}
					on:keydown={handleKeydownmoveAfter}
				>
					<Fa icon={faSortDown} size="lg" />
				</span>
			{/if}
		</div>
	{:else if enableEditing === true}
		{#if $mapStore}
			<StyleEditor bind:spriteLoader bind:selectedFormat bind:relativeLayers />
		{/if}
	{/if}
</div>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.layer-container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 0;
		height: 2.5rem;
		width: 100%;

		.draggable-icon {
			margin-left: 0.2rem;
			margin-right: 0.5rem;
		}

		.visible-button {
			padding-right: 0.5rem;
			cursor: pointer;
		}

		.legend {
			padding-right: 0.5rem;
			padding-top: 0.3rem;
			vertical-align: middle;
		}

		.layer-name {
			font-family:
				system-ui,
				-apple-system,
				system-ui,
				'Helvetica Neue',
				Helvetica,
				Arial,
				sans-serif;
			font-size: 16px;
			font-weight: 400;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-transform: capitalize;
			text-overflow: ellipsis;
			-webkit-text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
		}

		.layer-position {
			font-size: 9px;
			font-weight: 600;
			margin-right: 0.3rem;
			background-color: lightgreen;
			padding-top: 0.2rem;
			padding-left: 0.3rem;
			padding-right: 0.3rem;
			height: 20px;
		}

		.layer-order {
			display: flex;
			flex-direction: column;
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

	[data-tooltip]:hover:before,
	[data-tooltip]:hover:after,
	[data-tooltip]:focus:before,
	[data-tooltip]:focus:after {
		visibility: visible;
		opacity: 1;
	}
</style>
