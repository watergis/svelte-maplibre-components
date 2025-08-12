<script lang="ts">
	import {
		ValhallaIsochronePanel,
		ValhallaRoutingPanel,
		type ValhallaIsochroneOptions,
		type ValhallaRoutingOptions
	} from '$lib';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { Map, addProtocol } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let isMenuShown = $state(true);

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

	let valhallaUrl = $state('https://valhalla.water-gis.com');
	let valhallaIsochroneOptions: ValhallaIsochroneOptions = $state({
		Contours: [
			{
				time: 3,
				distance: 1,
				color: 'ff0000'
			},
			{
				time: 5,
				distance: 2,
				color: 'ffff00'
			},
			{
				time: 10,
				distance: 3,
				color: '0000ff'
			},
			{
				time: 15,
				distance: 4,
				color: 'ff00ff'
			}
		],
		isochrone: {
			font: ['Roboto Bold'],
			fontSize: 16,
			fontHalo: 1,
			fontColor: '#000000',
			fontHaloColor: '#fff'
		}
	});
	let valhallaRoutingOptions: ValhallaRoutingOptions = $state({
		font: ['Roboto Medium'],
		fontSize: 14,
		fontHalo: 3,
		fontColor: '#263238',
		fontHaloColor: '#fff',
		iconImage: 'marker',
		iconSize: 1
	});

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
	<title>Svelte maplibre valhalla example</title>
</sveltekit:head>

<MenuControl bind:map position="top-right" bind:isMenuShown>
	{#snippet sidebar()}
		<div class="primary-container">
			<h3>Isochrone tool</h3>
			<ValhallaIsochronePanel bind:map url={valhallaUrl} options={valhallaIsochroneOptions} />
			<hr />
			<h3>Routing tool</h3>
			<ValhallaRoutingPanel bind:map url={valhallaUrl} options={valhallaRoutingOptions} />
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
