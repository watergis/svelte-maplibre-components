<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import {
		ValhallaIsochronePanel,
		ValhallaRoutingPanel,
		type ValhallaIsochroneOptions,
		type ValhallaRoutingOptions
	} from '$lib';

	let isMenuShown = true;

	let mapContainer: HTMLDivElement;
	let map: Map;

	let valhallaUrl = 'https://valhalla.water-gis.com';
	let valhallaIsochroneOptions: ValhallaIsochroneOptions = {
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
	};
	let valhallaRoutingOptions: ValhallaRoutingOptions = {
		font: ['Roboto Medium'],
		fontSize: 14,
		fontHalo: 3,
		fontColor: '#263238',
		fontHaloColor: '#fff',
		iconImage: 'marker',
		iconSize: 1
	};

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	<div slot="primary">
		<div class="tile is-vertical">
			<div class="tile">
				<div class="container m-2 p-2">
					<ValhallaIsochronePanel
						bind:map
						bind:url={valhallaUrl}
						bind:options={valhallaIsochroneOptions}
					/>
				</div>
			</div>

			<div class="tile">
				<div class="container m-2 p-2">
					<ValhallaRoutingPanel
						bind:map
						bind:url={valhallaUrl}
						bind:options={valhallaRoutingOptions}
					/>
				</div>
			</div>
		</div>
	</div>
	<div slot="secondary">
		<div class="map" bind:this={mapContainer} />
	</div>
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
