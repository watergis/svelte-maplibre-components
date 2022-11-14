<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { MapExportControl, MapExportPanel } from '@watergis/svelte-maplibre-export';

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
	});
</script>

<div class="container">
	<div class="map" bind:this={mapContainer}>
		<div class="export-container">
			<MapExportPanel bind:map showPrintableArea={false} showCrosshair={false} />
		</div>
	</div>
	<MapExportControl bind:map showPrintableArea={true} showCrosshair={true} isShownSetting={true} />
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

			.export-container {
				position: absolute;
				top: 10px;
				left: 10px;
				z-index: 10;
			}
		}
	}
</style>
