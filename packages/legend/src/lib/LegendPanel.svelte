<script lang="ts">
	import type { StyleSpecification, LayerSpecification, Map } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import SpriteLoader from './sprite';
	import { invisibleLayerMap } from './stores';

	export let map: Map;
	export let style: StyleSpecification;
	export let onlyRendered = true;
	export let onlyRelative = true;
	let spriteLoader: SpriteLoader | undefined;

	$: allLayers = style ? style.layers : [];
	let visibleLayerMap: { [key: string]: LayerSpecification } = {};
	export let relativeLayers: { [key: string]: string } = {};

	$: {
		if (map) {
			map.on('moveend', updateLayers);
			map.on('styledata', updateLayers);
			map.on('load', () => {
				updateLayers();
			});
		}

		if (relativeLayers && Object.keys(relativeLayers).length === 0) {
			onlyRelative = false;
		}
	}

	$: onlyRendered, updateLayers();
	$: onlyRelative, updateLayers();
	$: style, handleStyleChanged();

	const handleStyleChanged = async () => {
		if (!map) return;
		if (!style) return;
		const styleUrl = style.sprite;
		if (!styleUrl) return;
		spriteLoader = new SpriteLoader(styleUrl);
		await spriteLoader.load();
		updateLayers();
	};

	const updateLayers = () => {
		if (!map) return;
		if (!style) return;
		setTimeout(() => {
			visibleLayerMap = {};
			if (onlyRendered === true) {
				Object.keys($invisibleLayerMap).forEach((layerId) => {
					visibleLayerMap[layerId] = $invisibleLayerMap[layerId];
				});
				const features = map.queryRenderedFeatures();
				allLayers.forEach((layer) => {
					const filtered = features.filter((f) => f.layer.id === layer.id);
					if (filtered.length > 0) {
						visibleLayerMap[layer.id] = layer;
					}
				});
			} else {
				allLayers.forEach((layer) => {
					visibleLayerMap[layer.id] = layer;
				});
			}
		}, 500);
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
</script>

<nav class="panel">
	{#if spriteLoader}
		{#key style}
			{#each allLayers as layer}
				{#if onlyRendered === true}
					{#if visibleLayerMap[layer.id]}
						{#if onlyRelative === true}
							{#if relativeLayers[layer.id]}
								<!-- svelte-ignore a11y-missing-attribute -->
								<a class="panel-block"
									><Layer
										{map}
										{layer}
										{spriteLoader}
										{relativeLayers}
										on:visibilityChanged={layerVisibilityChanged}
									/></a
								>
							{/if}
						{:else}
							<!-- svelte-ignore a11y-missing-attribute -->
							<a class="panel-block"
								><Layer
									{map}
									{layer}
									{spriteLoader}
									{relativeLayers}
									on:visibilityChanged={layerVisibilityChanged}
								/></a
							>
						{/if}
					{/if}
				{:else if onlyRelative === true}
					{#if relativeLayers[layer.id]}
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="panel-block"
							><Layer
								{map}
								{layer}
								{spriteLoader}
								{relativeLayers}
								on:visibilityChanged={layerVisibilityChanged}
							/></a
						>
					{/if}
				{:else}
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="panel-block"
						><Layer
							{map}
							{layer}
							{spriteLoader}
							{relativeLayers}
							on:visibilityChanged={layerVisibilityChanged}
						/></a
					>
				{/if}
			{/each}
		{/key}
	{/if}
</nav>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
