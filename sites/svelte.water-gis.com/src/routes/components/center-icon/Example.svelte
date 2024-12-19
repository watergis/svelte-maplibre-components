<script lang="ts">
	import CenterIconManager from '@watergis/maplibre-center-icon';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();

		const centerIconManager = new CenterIconManager(map);
		centerIconManager.create();
	});
</script>

<div class="map" bind:this={mapContainer}></div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.map {
		display: inline-block;
		text-align: left;
		width: 95%;
		height: $height;
		z-index: 1;
	}
</style>
