<script lang="ts">
	import { LegendHeader, LegendPanel } from '@watergis/svelte-maplibre-legend';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();
	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let menuHeight = $derived(innerHeight * 0.6);
	let menuWidth = $derived(innerWidth * 0.95);

	let isMenuShown = $state(true);

	let onlyRendered = $state(true);
	let onlyRelative = $state(true);
	let enableLayerOrder = $state(false);
	let relativeLayers: { [key: string]: string } = $state({
		pipeline: 'Pipeline',
		pipeline_annotation: 'Pipeline Label',
		meter: 'Water Meter',
		'flow meter': 'Flow Meter',
		valve: 'Valve',
		firehydrant: 'Fire Hydrant',
		washout: 'Washout',
		tank: 'Tank',
		tank_annotation: 'Tank Label',
		wtp: 'WTP',
		wtp_annotation: 'WTP Label',
		intake: 'Intake',
		intake_annotation: 'Intake Label',
		parcels: 'Parcels',
		parcels_annotation: 'Parcels Label',
		village: 'Village',
		village_annotation: 'Village Label',
		dma: 'DMA',
		'dma-annotation': 'DMA Label',
		'contour-line': 'Countour',
		'contour-label': 'Contour Label',
		hillshade: 'Hillshade',
		sewer_connection: 'Households (Sewer)',
		sewer_commercial: 'Commecial (Sewer)',
		sewer_institution: 'Institution (Sewer)',
		sewer_public_toilet: 'Public Toilet (Sewer)',
		manhole: 'Manhole',
		sewer_pipeline: 'Sewer pipeline',
		sewer_treatment_plant: 'Wastewater treatment plant'
	});

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<MenuControl bind:map position="top-right" bind:isMenuShown width={menuWidth} height={menuHeight}>
	{#snippet sidebar()}
		<div class="primary-container">
			<div class="legend-header">
				<LegendHeader
					bind:onlyRendered
					bind:onlyRelative
					bind:enableLayerOrder
					isLayerOrderShown={true}
				/>
			</div>
			<div class="legend-content" style="height:{menuHeight - 56}px">
				{#if map}
					<LegendPanel
						bind:map
						bind:onlyRendered
						bind:onlyRelative
						bind:relativeLayers
						bind:enableLayerOrder
						disableVisibleButton={false}
					/>
				{/if}
			</div>
		</div>
	{/snippet}
	{#snippet mapControl()}
		<div>
			<div class="map" bind:this={mapContainer}></div>
		</div>
	{/snippet}
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.primary-container {
		display: flex;
		flex-direction: column;
		position: relative;

		.legend-header {
			padding-left: 0.5rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
		}

		.legend-content {
			overflow-x: hidden;
			overflow-y: auto;
			width: 100%;
		}
	}
</style>
