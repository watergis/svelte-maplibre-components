<script lang="ts">
	import AttributeTableControl from '@watergis/svelte-maplibre-attribute-table';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	let width: number = $state();
	let height: number = $state();

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

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<AttributeTableControl
	bind:map
	position="top-right"
	rowsPerPage={50}
	minZoom={14}
	width={width * 0.95}
	height={height * 0.6}
>
	<div class="map" bind:this={mapContainer}></div>
</AttributeTableControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

	$height: calc(60vh);

	.map {
		display: inline-block;
		text-align: left;
		width: 100%;
		height: $height;
		z-index: 1;
	}
</style>
