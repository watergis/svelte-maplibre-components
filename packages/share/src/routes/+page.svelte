<script lang="ts">
	import ShareUrlControl from '$lib/ShareURLControl.svelte';
	import { addProtocol, Map } from 'maplibre-gl';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(() => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);

		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
			hash: true
		});
	});

	let customiseUrl = (url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('customise', 'true');
		return _url.toString();
	};
</script>

<sveltekit:head>
	<title>Svelte maplibre share example</title>
</sveltekit:head>

<div class="map" bind:this={mapContainer} />
<ShareUrlControl bind:map bind:customiseUrl />

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
