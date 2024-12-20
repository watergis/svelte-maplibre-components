<script lang="ts">
	import { MapExportControl, MapExportPanel } from '$lib';
	import { Map, addProtocol } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	onMount(() => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre export example</title>
</sveltekit:head>

<div class="map" bind:this={mapContainer}>
	<div class="export-container">
		<MapExportPanel bind:map showPrintableArea={false} showCrosshair={false} />
	</div>
</div>
<MapExportControl bind:map showPrintableArea={true} showCrosshair={true} isShownSetting={true} />

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
