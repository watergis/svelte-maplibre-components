<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import CenterIconManager from '$lib';

	let mapContainer: HTMLDivElement;
	let centerIconManager: CenterIconManager;

	let map: Map;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});

		centerIconManager = new CenterIconManager(map);
		centerIconManager.create();
	});
</script>

<div class="map" bind:this={mapContainer} />

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
