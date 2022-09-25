<script lang="ts">
	import { onMount } from 'svelte';
	import type { StyleSpecification, LayerSpecification, Map } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import SpriteLoader from './sprite';

	export let map: Map;
	let style: StyleSpecification;
	let onlyRendered = true;
	let onlyRelative = true;
	let spriteLoader: SpriteLoader;

	let allLayers: LayerSpecification[] = [];
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
	}

	$: onlyRendered, updateLayers();
	$: onlyRelative, updateLayers();

	onMount(async () => {
		if (!map) return;
		if (!spriteLoader) {
			const styleUrl = map.getStyle().sprite;
			spriteLoader = new SpriteLoader(styleUrl);
			await spriteLoader.load();
		}
	});

	export const updateLayers = () => {
		if (!map) return;
		if (!map.isStyleLoaded()) return;
		style = map.getStyle();
		allLayers = style.layers;
		setTimeout(() => {
			updateVisibleLayers();
		}, 500);
	};

	const updateVisibleLayers = () => {
		visibleLayerMap = {};
		if (map && map.queryRenderedFeatures) {
			const features = map.queryRenderedFeatures();
			for (let feature of features) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				visibleLayerMap[feature.layer.id] = feature.layer;
			}
		}
	};
</script>

<nav class="panel">
	<div class="panel-block">
		<label class="checkbox">
			<input type="checkbox" bind:checked={onlyRendered} />
			Show only rendered layers
		</label>
	</div>
	<div class="panel-block">
		<label class="checkbox">
			<input type="checkbox" bind:checked={onlyRelative} />
			Show only water layers
		</label>
	</div>

	{#key style}
		{#each allLayers as layer}
			{#if onlyRendered === true}
				{#if visibleLayerMap[layer.id]}
					{#if onlyRelative === true}
						{#if relativeLayers[layer.id]}
							<!-- svelte-ignore a11y-missing-attribute -->
							<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
						{/if}
					{:else}
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
					{/if}
				{/if}
			{:else if onlyRelative === true}
				{#if relativeLayers[layer.id]}
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
				{/if}
			{:else}
				<!-- svelte-ignore a11y-missing-attribute -->
				<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
			{/if}
		{/each}
	{/key}
</nav>

<style lang="scss">
	@import 'bulma/css/bulma.css';
</style>
