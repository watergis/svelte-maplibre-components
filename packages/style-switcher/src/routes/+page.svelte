<script lang="ts">
	import { StyleSwitcher, StyleSwitcherControl, StyleUrl, type StyleSwitcherOption } from '$lib';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { Map, addProtocol } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let isMenuShown = true;
	let mapContainer: HTMLDivElement;
	let map: Map;

	let styles: StyleSwitcherOption[] = [
		{
			title: 'UNVT Water (OSM)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
		},
		{
			title: 'UNVT Water (Building)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-buildings.json`
		},
		{
			title: 'Satellite Water',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json`
		},
		{
			title: 'UNVT Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-sewer.json`
		},
		{
			title: 'Satellite Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial-sewer.json`
		}
	];
	let selectedStyle: StyleSwitcherOption = styles[0];

	onMount(() => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);

		const styleUrlObj = new StyleUrl();
		selectedStyle = styleUrlObj.getInitialStyle(styles);

		map = new Map({
			container: mapContainer,
			style: selectedStyle.uri
		});
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre style switcher example</title>
</sveltekit:head>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	<div slot="sidebar" class="contents">
		<StyleSwitcher bind:map bind:styles bind:selectedStyle />
	</div>
	<div slot="map">
		<div class="map" bind:this={mapContainer}>
			<StyleSwitcherControl bind:map bind:styles bind:selectedStyle position="top-left" />
		</div>
	</div>
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

	.contents {
		margin: 0.5rem;
	}

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
