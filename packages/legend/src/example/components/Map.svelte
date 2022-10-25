<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl, AttributionControl } from 'maplibre-gl';
	import { map } from '$example/stores';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { LegendPanel, LegendHeader } from '$lib';
	import type { StyleSpecification } from 'maplibre-gl';

	let isMenuShown = true;
	let style: StyleSpecification;
	$: {
		if ($map) {
			$map.on('load', () => {
				style = $map.getStyle();
			});
		}
	}

	let onlyRendered = true;
	let onlyRelative = true;
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

	let mapContainer: HTMLDivElement;

	onMount(async () => {
		const map2 = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
			center: { lng: 35.87063, lat: -1.08551 },
			zoom: 13,
			hash: true,
			attributionControl: false
		});
		map2.addControl(
			new NavigationControl({
				visualizePitch: false,
				showZoom: true,
				showCompass: true
			}),
			'top-right'
		);
		map2.addControl(new AttributionControl({ compact: true }), 'bottom-right');

		map.update(() => map2);
	});
</script>

<MenuControl bind:map={$map} position={'top-right'} bind:isMenuShown>
	<div slot="primary">
		<div class="legend-header">
			<LegendHeader bind:onlyRendered bind:onlyRelative {relativeLayers} />
		</div>
		<div class="legend-content">
			<LegendPanel bind:map={$map} {style} bind:onlyRendered bind:onlyRelative {relativeLayers} />
		</div>
	</div>
	<div slot="secondary">
		<div class="map" id="map" bind:this={mapContainer} />
	</div>
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.legend-header {
		padding: 5px;
	}

	$height: calc(100vh - 52px);

	.legend-content {
		position: absolute;
		overflow-x: hidden;
		overflow-y: auto;
		height: $height;
		width: 100%;
	}
</style>
