<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';

	let mapContainer: HTMLDivElement;
	let map: Map;

	let targetLayers = [
		'meter',
		'flow meter',
		'valve',
		'washout',
		'firehydrant',
		'tank',
		'pipeline',
		'pg-building',
		'sewer-connection',
		'sewer_commercial',
		'sewer_institution',
		'sewer_public_toilet',
		'sewer_pipeline',
		'sewer_treatment_plant',
		'manhole'
	];

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
	<div class="map" bind:this={mapContainer} />
	<AttributePopupControl bind:map {targetLayers} />
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
