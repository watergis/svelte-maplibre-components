<script lang="ts">
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

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

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<div class="map" bind:this={mapContainer}></div>
<AttributePopupControl bind:map {targetLayers} />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.map {
		display: inline-block;
		text-align: left;
		width: 100%;
		height: $height;
		z-index: 1;
	}
</style>
