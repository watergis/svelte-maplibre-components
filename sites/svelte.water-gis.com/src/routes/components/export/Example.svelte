<script lang="ts">
	import { MapExportControl, MapExportPanel } from '@watergis/svelte-maplibre-export';
	import { Map, NavigationControl, addProtocol } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	onMount(() => {
		let protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);

		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<div class="map" bind:this={mapContainer}>
	<div class="export-container">
		<MapExportPanel bind:map showPrintableArea={false} showCrosshair={false} />
	</div>
	<MapExportControl bind:map showPrintableArea={true} showCrosshair={true} isShownSetting={true} />
</div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.map {
		display: inline-block;
		text-align: left;
		width: 100%;
		height: $height;
		z-index: 1;

		.export-container {
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 10;
		}
	}
</style>
