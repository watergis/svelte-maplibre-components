<script lang="ts">
	import { MeasurePanel, type MeasureOption } from '$lib';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { Map, addProtocol } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let isMenuShown = $state(true);

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	let terrainRgbUrl = $state('https://wasac.github.io/rw-terrain-webp/tiles/{z}/{x}/{y}.webp');
	let measureOption: MeasureOption = $state({
		tileSize: 512,
		font: ['Roboto Medium'],
		fontSize: 12,
		fontHalo: 1,
		mainColor: '#263238',
		haloColor: '#fff'
	});

	onMount(async () => {
		window.global = window;
		const Buffer = await (await import('buffer')).Buffer;
		window.Buffer = Buffer;

		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);

		map = new Map({
			container: mapContainer,
			style: 'https://wasac.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre measure example</title>
</sveltekit:head>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	{#snippet sidebar()}
		<div class="primary-container">
			<h4>Measure tool with elevation enquiry</h4>
			<MeasurePanel bind:map {measureOption} {terrainRgbUrl} />
		</div>
	{/snippet}
	{#snippet mapControl()}
		<div>
			<div class="map" bind:this={mapContainer}></div>
		</div>
	{/snippet}
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.primary-container {
		margin: 0.5rem;
	}
</style>
