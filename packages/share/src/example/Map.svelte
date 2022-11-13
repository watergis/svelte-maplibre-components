<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import ShareUrlControl from '$lib/ShareURLControl.svelte';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
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
