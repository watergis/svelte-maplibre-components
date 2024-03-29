<script context="module" lang="ts">
	import { createMapStore } from '$lib/stores';
	import { getContext, setContext } from 'svelte';

	const MAP_CONTEXT_KEY = 'maplibre-legend-map';

	export const getMapContext = (): ReturnType<typeof createMapStore> => {
		const mapStore: ReturnType<typeof createMapStore> = getContext(MAP_CONTEXT_KEY);
		return mapStore;
	};

	export const setMapContext = () => {
		let mapStore: ReturnType<typeof createMapStore> = createMapStore();
		setContext(MAP_CONTEXT_KEY, mapStore);
		return mapStore;
	};
</script>

<script lang="ts">
	import type { LayerSpecification, Map, StyleSpecification } from 'maplibre-gl';
	import { writable } from 'svelte/store';
	import Layer from './Layer.svelte';
	import SpriteLoader from './sprite';
	import { distinct } from './util/distinct';

	export let map: Map;
	export let onlyRendered = true;
	export let onlyRelative = true;
	export let enableLayerOrder = false;
	export let disableVisibleButton = false;
	export let enableEditing = true;

	const mapStore = setMapContext();
	const invisibleLayerMap = writable<{ [key: string]: LayerSpecification }>({});

	let style: StyleSpecification;
	let spriteLoader: SpriteLoader | undefined;
	let hovering: boolean | number | undefined = false;
	export let defaultEditorFormat: 'yaml' | 'json' = 'yaml';
	$: isShowLastDropArea = hovering === getLastVisibleIndex();

	$: allLayers = style ? style.layers : [];
	let visibleLayerMap: { [key: string]: LayerSpecification } = {};
	export let relativeLayers: { [key: string]: string } = {};

	$: {
		if (map) {
			mapStore.set(map);

			$mapStore.on('moveend', updateLayers);
			$mapStore.on('styledata', updateLayers);
			$mapStore.on('load', () => {
				style = map.getStyle();
			});
			$mapStore.on('style:change', handleStyleChanged);
		}

		if (relativeLayers && Object.keys(relativeLayers).length === 0) {
			onlyRelative = false;
		}
	}

	$: onlyRendered, updateLayers();
	$: onlyRelative, updateLayers();
	$: style, handleStyleChanged();

	const handleStyleChanged = (isLoadSprite = true) => {
		if (!$mapStore) return;
		if (!style) return;
		const styleUrl = style.sprite;
		if (!styleUrl) return;
		if ($mapStore.isStyleLoaded()) {
			if (isLoadSprite === true) {
				spriteLoader = new SpriteLoader(styleUrl);
				spriteLoader.load().then(updateLayers);
			} else {
				updateLayers();
			}
		} else {
			setTimeout(handleStyleChanged, 500);
		}
	};

	const updateLayers = () => {
		if (!$mapStore) return;
		if (!style) return;
		visibleLayerMap = {};
		const all = $mapStore.getStyle().layers;
		if (onlyRendered === true) {
			Object.keys($invisibleLayerMap).forEach((layerId) => {
				visibleLayerMap[layerId] = $invisibleLayerMap[layerId];
				if ($mapStore.getLayer(layerId)) {
					mapStore.setLayoutProperty(layerId, 'visibility', 'none');
				}
			});
			const features = $mapStore.queryRenderedFeatures();
			const ids = features.map((f) => f.layer.id).filter(distinct);
			const zoom = $mapStore.getZoom();
			all.forEach((layer: LayerSpecification) => {
				const minzoom = layer.minzoom ?? 0;
				const maxzoom = layer.maxzoom ?? 24;
				if (ids.indexOf(layer.id) !== -1) {
					visibleLayerMap[layer.id] = layer;
				} else if (['heatmap', 'hillshade'].includes(layer.type)) {
					if (zoom >= minzoom && zoom <= maxzoom) {
						visibleLayerMap[layer.id] = layer;
					}
				}
			});
		} else {
			all.forEach((layer: LayerSpecification) => {
				visibleLayerMap[layer.id] = layer;
			});
		}
		allLayers = [...all];
	};

	const layerVisibilityChanged = (e: {
		detail: { layer: LayerSpecification; visibility: 'visible' | 'none' };
	}) => {
		const layer: LayerSpecification = e.detail.layer;
		const visibility = e.detail.visibility;
		if (visibility === 'none') {
			$invisibleLayerMap[layer.id] = layer;
		} else {
			if ($invisibleLayerMap[layer.id]) {
				delete $invisibleLayerMap[layer.id];
			}
		}
	};

	const layerOrderChanged = () => {
		allLayers = $mapStore.getStyle().layers;
		handleStyleChanged(false);
	};

	const drop = (
		/* eslint-disable @typescript-eslint/no-explicit-any */
		event: any,
		target: number,
		layer?: LayerSpecification
	) => {
		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));
		const newTracklist = allLayers;

		if (start <= target) {
			newTracklist.splice(target + 1, 0, newTracklist[start]);
			newTracklist.splice(start, 1);
		} else {
			newTracklist.splice(target, 0, newTracklist[start]);
			newTracklist.splice(start + 1, 1);
		}
		allLayers = newTracklist;
		hovering = undefined;

		const targetLayer = allLayers[target];
		if (layer?.id) {
			$mapStore.moveLayer(targetLayer.id, layer.id);
		} else {
			const startLayer = $mapStore.getStyle().layers[start];
			$mapStore.moveLayer(startLayer.id);
		}
		layerOrderChanged();
	};

	const dragstart = (
		/* eslint-disable @typescript-eslint/no-explicit-any */
		event: any,
		i: number
	) => {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start);
	};

	const dragover = (
		/* eslint-disable @typescript-eslint/no-explicit-any */
		event: any
	) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	};

	const getLastVisibleIndex = () => {
		let lastIndex = 0;
		allLayers?.forEach((layer, index) => {
			if (onlyRendered === true) {
				if (visibleLayerMap[layer.id]) {
					if (onlyRelative === true) {
						if (relativeLayers[layer.id]) {
							lastIndex = index;
						}
					} else {
						lastIndex = index;
					}
				}
			} else if (onlyRelative === true) {
				if (relativeLayers[layer.id]) {
					lastIndex = index;
				}
			} else {
				lastIndex = index;
			}
		});
		return lastIndex + 1;
	};

	const isRelativeLayer = (layerId: string) => {
		let isRelative = false;
		if (relativeLayers[layerId]) {
			isRelative = true;
		} else {
			if (layerId.indexOf('heatmap') > 0 && relativeLayers[layerId.replace('heatmap', '').trim()]) {
				isRelative = true;
			}
		}
		return isRelative;
	};

	const showOnList = (layerId: string) => {
		let isShow = false;
		if (onlyRendered === true) {
			if (visibleLayerMap[layerId]) {
				if (onlyRelative === true) {
					if (isRelativeLayer(layerId)) {
						isShow = true;
					}
				} else {
					isShow = true;
				}
			}
		} else if (onlyRelative === true) {
			if (isRelativeLayer(layerId)) {
				isShow = true;
			}
		} else {
			isShow = true;
		}
		return isShow;
	};
</script>

<ul class="legend-panel">
	{#if $mapStore && spriteLoader}
		{#key style}
			{#each allLayers as layer, index (layer.id)}
				{#if showOnList(layer.id)}
					<div
						class="list-item"
						role="listitem"
						draggable={enableLayerOrder}
						on:dragstart={(event) => dragstart(event, index)}
						on:drop|preventDefault={(event) => drop(event, index, layer)}
						on:dragover={(event) => dragover(event)}
						on:dragenter={() => {
							hovering = index;
						}}
						class:is-active={hovering === index}
					>
						<li class="legend-panel-block">
							<Layer
								{layer}
								{spriteLoader}
								{relativeLayers}
								bind:enableLayerOrder
								bind:disableVisibleButton
								bind:enableEditing
								bind:selectedFormat={defaultEditorFormat}
								on:visibilityChanged={layerVisibilityChanged}
								on:layerOrderChanged={layerOrderChanged}
							/>
						</li>
					</div>
				{/if}
			{/each}
			{#if enableLayerOrder}
				<div
					class="list-item"
					role="listitem"
					style="height: 40px;"
					draggable={false}
					on:drop|preventDefault={(event) => drop(event, getLastVisibleIndex())}
					on:dragover={(event) => dragover(event)}
					on:dragenter={() => {
						hovering = getLastVisibleIndex();
					}}
					class:is-active={hovering === getLastVisibleIndex()}
				>
					{#if isShowLastDropArea}
						<div class="last-drop-area">Drag to the last</div>
					{/if}
				</div>
			{/if}
		{/key}
	{/if}
</ul>

<style lang="scss">
	.legend-panel {
		display: block;
		list-style-type: disc;
		margin-block-start: 0em;
		margin-block-end: 0em;
		margin-inline-start: 0px;
		margin-inline-end: 0px;
		padding-inline-start: 0.5rem;

		.list-item {
			display: block;
		}

		.list-item:not(:last-child) {
			border-bottom: 0.5px solid rgb(197, 197, 197);
		}

		.list-item.is-active {
			border-top: 3px solid rgb(111, 111, 111);
			background-color: rgb(197, 197, 197);
		}

		.last-drop-area {
			font-weight: bold;
			background-color: #f5f5f5;
			text-align: center;
			padding-top: 30px;
			padding-bottom: 30px;
			width: 100%;
		}

		.legend-panel-block {
			display: flex;
			vertical-align: middle;
			justify-content: left;
			align-items: left;
			margin: 0;
			padding: 0.2rem;
			border-bottom: 0.1rem solid rgb(197, 197, 197);
		}

		.legend-panel-block li {
			display: block;
		}

		.legend-panel-block:hover {
			background-color: rgb(239, 239, 239);
		}
	}
</style>
