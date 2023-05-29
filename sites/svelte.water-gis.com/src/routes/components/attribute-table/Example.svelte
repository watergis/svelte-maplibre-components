<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import AttributeTableControl from '@watergis/svelte-maplibre-attribute-table';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});

		map.addControl(new NavigationControl(), 'top-right');
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<div class="container">
	<AttributeTableControl bind:map position="top-right" rowsPerPage="25" minZoom="14">
		<div class="map" bind:this={mapContainer} />
	</AttributeTableControl>
</div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(100vh);

	.container {
		margin: auto;
		width: 95%;

		.map {
			display: inline-block;
			text-align: left;
			width: 95%;
			height: $height;
			z-index: 1;
		}
	}
</style>
