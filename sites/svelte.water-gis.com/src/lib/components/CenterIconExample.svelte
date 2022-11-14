<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import CenterIconManager from '@watergis/maplibre-center-icon';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
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

<div class="container">
	<div class="map" bind:this={mapContainer} />
</div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.container {
		text-align: center;

		.map {
			display: inline-block;
			text-align: left;
			width: 95%;
			height: $height;
			z-index: 1;
		}
	}
</style>
