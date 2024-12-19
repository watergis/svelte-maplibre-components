<script lang="ts">
	import AttributeTableControl from '$lib';
	import { addProtocol, Map, NavigationControl } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement | undefined = $state();
	let map: Map | undefined = $state();

	onMount(() => {
		if (!mapContainer) return;
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
			hash: true
		});

		map.addControl(new NavigationControl(), 'top-right');
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre attribute table example</title>

	<link rel="stylesheet" href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" />
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
	/>
</sveltekit:head>

<AttributeTableControl bind:map position="top-right" rowsPerPage={50} minZoom={14}>
	<div class="map" bind:this={mapContainer}></div>
</AttributeTableControl>

<style>
	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
