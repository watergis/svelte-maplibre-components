<script lang="ts">
	import type { StyleSpecification, LayerSpecification, Map } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import SpriteLoader from './sprite';
	import { invisibleLayerMap } from './stores';
	import { distinct } from './util/distinct';

	export let map: Map;
	export let style: StyleSpecification;
	export let onlyRendered = true;
	export let onlyRelative = true;
	export let enableLayerOrder = false;
	export let disableVisibleButton = false;
	export let enableEditing = true;
	let spriteLoader: SpriteLoader | undefined;
	let hovering: boolean | number | undefined = false;
	$: isShowLastDropArea = hovering === getLastVisibleIndex();

	$: allLayers = style ? style.layers : [];
	let visibleLayerMap: { [key: string]: LayerSpecification } = {};
	export let relativeLayers: { [key: string]: string } = {};

	$: {
		if (map) {
			map.on('moveend', updateLayers);
			map.on('styledata', updateLayers);
			map.on('load', updateLayers);
			map.on('style:changed', () => {
				handleStyleChanged(false);
			});
		}

		if (relativeLayers && Object.keys(relativeLayers).length === 0) {
			onlyRelative = false;
		}
	}

	$: onlyRendered, updateLayers();
	$: onlyRelative, updateLayers();
	$: style, handleStyleChanged();

	const handleStyleChanged = (isLoadSprite = true) => {
		if (!map) return;
		if (!style) return;
		const styleUrl = style.sprite;
		if (!styleUrl) return;
		if (isLoadSprite === true) {
			spriteLoader = new SpriteLoader(styleUrl);
			spriteLoader.load().then(updateLayers);
		} else {
			updateLayers();
		}
	};

	const updateLayers = () => {
		if (!map) return;
		if (!style) return;
		visibleLayerMap = {};
		const all = map.getStyle().layers;
		if (onlyRendered === true) {
			Object.keys($invisibleLayerMap).forEach((layerId) => {
				visibleLayerMap[layerId] = $invisibleLayerMap[layerId];
			});
			const features = map.queryRenderedFeatures();
			const ids = features.map((f) => f.layer.id).filter(distinct);
			const zoom = map.getZoom();
			all.forEach((layer) => {
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
			all.forEach((layer) => {
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
		allLayers = map.getStyle().layers;
		handleStyleChanged(false);
	};

	const drop = (event: any, target: number, layer?: LayerSpecification) => {
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
			map.moveLayer(targetLayer.id, layer.id);
		} else {
			const startLayer = map.getStyle().layers[start];
			map.moveLayer(startLayer.id);
		}
		layerOrderChanged();
	};

	const dragstart = (event: any, i: number) => {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start);
	};

	const dragover = (event: any) => {
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
</script>

<ul class="legend-panel">
	{#if spriteLoader}
		{#key style}
			{#key allLayers}
				{#each allLayers as layer, index (layer.id)}
					{#if onlyRendered === true}
						{#key visibleLayerMap}
							{#if visibleLayerMap[layer.id]}
								{#if onlyRelative === true}
									{#if isRelativeLayer(layer.id)}
										<div
											class="list-item"
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
													{map}
													{layer}
													{spriteLoader}
													{relativeLayers}
													bind:enableLayerOrder
													bind:disableVisibleButton
													bind:enableEditing
													on:visibilityChanged={layerVisibilityChanged}
													on:layerOrderChanged={layerOrderChanged}
												/>
											</li>
										</div>
									{/if}
								{:else}
									<div
										class="list-item"
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
												{map}
												{layer}
												{spriteLoader}
												{relativeLayers}
												bind:enableLayerOrder
												bind:disableVisibleButton
												bind:enableEditing
												on:visibilityChanged={layerVisibilityChanged}
												on:layerOrderChanged={layerOrderChanged}
											/>
										</li>
									</div>
								{/if}
							{/if}
						{/key}
					{:else if onlyRelative === true}
						{#if isRelativeLayer(layer.id)}
							<div
								class="list-item"
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
										{map}
										{layer}
										{spriteLoader}
										{relativeLayers}
										bind:enableLayerOrder
										bind:disableVisibleButton
										bind:enableEditing
										on:visibilityChanged={layerVisibilityChanged}
										on:layerOrderChanged={layerOrderChanged}
									/>
								</li>
							</div>
						{/if}
					{:else}
						<div
							class="list-item"
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
									{map}
									{layer}
									{spriteLoader}
									{relativeLayers}
									bind:enableLayerOrder
									bind:disableVisibleButton
									bind:enableEditing
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
