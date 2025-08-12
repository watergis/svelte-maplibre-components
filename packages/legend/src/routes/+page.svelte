<script lang="ts">
	import { LegendHeader, LegendPanel } from '$lib';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import {
		StyleSwitcher,
		StyleUrl,
		type StyleSwitcherOption
	} from '@watergis/svelte-maplibre-style-switcher';
	import maplibregl, { Map } from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';
	import { onMount } from 'svelte';

	let protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	let isMenuShown = $state(true);

	let styles = $state([
		{
			title: 'UNVT Water (OSM)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
		},
		{
			title: 'UNVT Water (Building)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-buildings.json`
		},
		{
			title: 'Satellite Water',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json`
		},
		{
			title: 'UNVT Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-sewer.json`
		},
		{
			title: 'Satellite Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial-sewer.json`
		}
	]);

	const styleUrlObj = new StyleUrl();
	const getDefaultStyle = () => {
		return styleUrlObj.getInitialStyle(styles);
	};
	let selectedStyle: StyleSwitcherOption = $state(getDefaultStyle());

	let onlyRendered = $state(true);
	let onlyRelative = $state(true);
	let enableLayerOrder = $state(false);
	let enableEditing = $state(true);

	let relativeLayers: { [key: string]: string } = {
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
	};

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			// style: 'https://undp-data.github.io/style/style.json'
			// style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json'
			style: selectedStyle.uri,
			hash: true
		});
	});

	const onStyleChange = () => {
		if (!map) return;
		map.fire('style:change');
	};
</script>

<sveltekit:head>
	<title>Svelte maplibre legend example</title>
</sveltekit:head>

<MenuControl bind:map position="top-right" bind:isMenuShown>
	{#snippet sidebar()}
		<div class="primary-container">
			<div class="style-header">
				<StyleSwitcher bind:map bind:selectedStyle {styles} onchange={onStyleChange} />
			</div>
			<div class="legend-header">
				<LegendHeader
					bind:onlyRendered
					bind:onlyRelative
					bind:enableLayerOrder
					isLayerOrderShown={true}
				/>
			</div>
			<div class="legend-content">
				{#if map}
					<LegendPanel
						bind:map
						bind:onlyRendered
						bind:onlyRelative
						bind:enableLayerOrder
						bind:enableEditing
						{relativeLayers}
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

	$height: calc(100vh - 140px);

	.primary-container {
		display: flex;
		flex-direction: column;
		position: relative;

		.style-header {
			width: 100%;
			margin-bottom: 0.5rem;
		}

		.legend-header {
			padding-left: 0.5rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
		}

		.legend-content {
			overflow-x: hidden;
			overflow-y: auto;
			height: $height;
			width: 100%;
		}
	}
</style>
