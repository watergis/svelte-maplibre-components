<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import AttributeTableControl from '$lib';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
			hash: true
		});

		map.addControl(new NavigationControl(), 'top-right');
	});
</script>

<AttributeTableControl bind:map position="top-right" rowsPerPage={50} minZoom={14}>
	<div class="map" bind:this={mapContainer} />
</AttributeTableControl>

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
