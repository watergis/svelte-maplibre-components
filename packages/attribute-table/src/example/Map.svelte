<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { AttributeTableControl } from '$lib';

	let mapContainer: HTMLDivElement;
	let map: Map;
	let sourceIds = ['assets'];

	$: {
		if (mapContainer) {
			map = new Map({
				container: mapContainer,
				style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
				hash: true
			});
		}
	}
</script>

<AttributeTableControl bind:map bind:sourceIds>
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
