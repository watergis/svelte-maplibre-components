<script lang="ts">
	import type { StyleSpecification, LayerSpecification, Map } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import SpriteLoader from './sprite';

	export let map: Map;
	export let style: StyleSpecification;
	let onlyRendered = true;
	let onlyRelative = true;
	let spriteLoader: SpriteLoader | undefined;

	let allLayers: LayerSpecification[] = [];
	let visibleLayerMap: { [key: string]: LayerSpecification } = {};
	export let relativeLayers: { [key: string]: string } = {};

	$: {
		if (map) {
			map.on('moveend', updateLayers);
			map.on('styledata', updateLayers);

			map.on('load', () => {
				if (style && !spriteLoader && map.isStyleLoaded()) {
					const styleUrl = style.sprite;
					if (!styleUrl) return;
					const loader = new SpriteLoader(styleUrl);
					loader.load().then(() => {
						spriteLoader = loader;
					});
				}
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
		spriteLoader = undefined;
		await updateLayers();
	};

	const updateLayers = async () => {
		if (!map) return;
		if (!style) return;
		if (!spriteLoader) {
			const styleUrl = style.sprite;
			if (!styleUrl) return;
			const loader = new SpriteLoader(styleUrl);
			await loader.load();
			spriteLoader = loader;
		}

		allLayers = style.layers;
		setTimeout(() => {
			updateVisibleLayers();
		}, 500);
	};

	const updateVisibleLayers = () => {
		if (map && map.queryRenderedFeatures) {
			const visible: { [key: string]: LayerSpecification } = {};
			const features = map.queryRenderedFeatures();
			for (let feature of features) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				visible[feature.layer.id] = feature.layer;
			}
			visibleLayerMap = visible;
		} else {
			visibleLayerMap = {};
		}
	};
</script>

<nav class="panel">
	<div class="tabs is-toggle is-fullwidth m-2">
		<ul>
			<li class={onlyRendered ? 'is-active' : ''} on:click={() => (onlyRendered = !onlyRendered)}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a>
					<span>Show rendered</span>
				</a>
			</li>
			{#if relativeLayers && Object.keys(relativeLayers).length > 0}
				<li class={onlyRelative ? 'is-active' : ''} on:click={() => (onlyRelative = !onlyRelative)}>
					<!-- svelte-ignore a11y-missing-attribute -->
					<a>
						<span>Show related</span>
					</a>
				</li>
			{/if}
		</ul>
	</div>

	{#if spriteLoader}
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
	{/if}
</nav>

<style lang="scss">
	@import 'bulma/css/bulma.css';
</style>
