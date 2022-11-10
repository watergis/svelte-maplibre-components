<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
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
	});
</script>

<div class="map" bind:this={mapContainer} />
<AttributePopupControl bind:map {targetLayers} />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'bulma/bulma.sass';

	$height: calc(50vh);

	.map {
		width: 100%;
		height: $height;
		z-index: 1;
	}
</style>
