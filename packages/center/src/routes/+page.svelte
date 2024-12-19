<script lang="ts">
	import CenterIconManager from '$lib';
	import { addProtocol, Map } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let centerIconManager: CenterIconManager;

	let map: Map;

	onMount(() => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});

		centerIconManager = new CenterIconManager(map);
		centerIconManager.create();
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre center icon example</title>
</sveltekit:head>

<div class="map" bind:this={mapContainer}></div>

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
