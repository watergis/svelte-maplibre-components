<script lang="ts">
	import { MenuControl } from '$lib';
	import { addProtocol, Map } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});

	const onChange = (e) => {
		console.log(e.detail);
	};
</script>

<MenuControl
	bind:map
	position={'top-left'}
	isMenuShown={false}
	sidebarOnLeft={false}
	isHorizontal={false}
	faIcon="fa-solid fa-bars"
	faIconSize=""
	on:changed={onChange}
	showMenuButtonOnMap={true}
>
	<div slot="sidebar">content</div>
	<div slot="map">
		<div class="map" bind:this={mapContainer} />
	</div>
</MenuControl>

<style>
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
</style>
