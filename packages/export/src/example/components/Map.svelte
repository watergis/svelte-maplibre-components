<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MapExportControl, MapExportPanel } from '$lib';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<div class="map" bind:this={mapContainer}>
	<div class="export-container">
		<MapExportPanel bind:map showPrintableArea={false} showCrosshair={false} />
	</div>
</div>
<MapExportControl bind:map showPrintableArea={true} showCrosshair={true} />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;

		.export-container {
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 10;
		}
	}
</style>
