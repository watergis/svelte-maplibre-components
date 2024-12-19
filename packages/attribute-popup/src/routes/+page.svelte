<script lang="ts">
	import AttributePopupControl from '$lib';
	import { addProtocol, Map } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	let targetLayers = [
		'meter',
		'flow meter',
		'valve',
		'washout',
		'firehydrant',
		'tank',
		'pipeline',
		'pg-building',
		'sewer-connection',
		'sewer_commercial',
		'sewer_institution',
		'sewer_public_toilet',
		'sewer_pipeline',
		'sewer_treatment_plant',
		'manhole'
	];

	onMount(async () => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);

		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre legend example</title>
</sveltekit:head>

<div class="map" bind:this={mapContainer}></div>
<AttributePopupControl bind:map {targetLayers} />

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
