<script lang="ts">
	import type { StyleSpecification, LayerSpecification, Map } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import SpriteLoader from './sprite';

	export let map: Map;
	export let style: StyleSpecification;
	let onlyRendered = true;
	let onlyRelative = true;
	let spriteLoader: SpriteLoader | undefined;

	$: allLayers = style ? style.layers : [];
	let visibleLayerMap: { [key: string]: LayerSpecification } = {};
	export let relativeLayers: { [key: string]: string } = {};
	let invisibleLayerMap: { [key: string]: LayerSpecification } = {};

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
				const features = map.queryRenderedFeatures();
				allLayers.forEach((layer) => {
					const filtered = features.filter((f) => f.layer.id === layer.id);
					if (filtered.length > 0 || invisibleLayerMap[layer.id]) {
						visibleLayerMap[layer.id] = layer;
					}
				});
			} else {
				allLayers.forEach((layer) => {
					visibleLayerMap[layer.id] = layer;
				});
			}
			if (Object.keys(invisibleLayerMap).length > 0) {
				allLayers = map.getStyle().layers;
			}
		}, 500);
	};

	const layerVisibilityChanged = (e: { detail: { layer: LayerSpecification } }) => {
		const layer: LayerSpecification = e.detail.layer;
		if (layer.layout?.visibility === undefined || layer.layout?.visibility === 'none') {
			invisibleLayerMap[layer.id] = layer;
		} else {
			if (invisibleLayerMap[layer.id]) {
				delete invisibleLayerMap[layer.id];
			}
		}
	};
</script>

<nav class="panel">
	<div class="tabs is-toggle is-fullwidth m-2 legend-header">
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

	<nav class="panel legend-content">
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
</nav>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.legend-content {
		position: absolute;
		overflow: auto;
		padding-top: 5px;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>
