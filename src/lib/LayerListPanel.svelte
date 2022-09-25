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

		if (relativeLayers && Object.keys(relativeLayers).length === 0) {
			onlyRelative = false;
		}
	}

	$: onlyRendered, updateLayers();
	$: onlyRelative, updateLayers();

	onMount(async () => {
		if (!map) return;
		if (!spriteLoader && map.isStyleLoaded()) {
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
	<!-- <div class="panel-block"> -->
	<div class="tabs is-toggle is-fullwidth m-2">
		<ul>
			<li class={onlyRendered ? 'is-active' : ''} on:click={() => (onlyRendered = !onlyRendered)}>
				<a>
					<span>Show rendered</span>
				</a>
			</li>
			{#if relativeLayers && Object.keys(relativeLayers).length > 0}
				<li class={onlyRelative ? 'is-active' : ''} on:click={() => (onlyRelative = !onlyRelative)}>
					<a>
						<span>Show related</span>
					</a>
				</li>
			{/if}
		</ul>
	</div>
	<!-- </div> -->

	{#key style}
		{#each allLayers as layer}
			{#if onlyRendered === true}
				{#if visibleLayerMap[layer.id]}
					{#if onlyRelative === true}
						{#if relativeLayers[layer.id]}
							<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
						{/if}
					{:else}
						<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
					{/if}
				{/if}
			{:else if onlyRelative === true}
				{#if relativeLayers[layer.id]}
					<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
				{/if}
			{:else}
				<a class="panel-block"><Layer {map} {layer} {spriteLoader} {relativeLayers} /></a>
			{/if}
		{/each}
	{/key}
</nav>

<style lang="scss">
	@import 'bulma/css/bulma.css';
</style>
