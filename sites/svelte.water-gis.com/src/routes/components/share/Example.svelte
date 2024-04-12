<script lang="ts">
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});

	let customiseUrl = (url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('customise', 'true');
		return _url.toString();
	};
</script>

<div class="container">
	<div class="map" bind:this={mapContainer} />
	<ShareURLControl bind:map bind:customiseUrl />
</div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.container {
		.map {
			display: inline-block;
			width: 95%;
			height: $height;
			z-index: 1;
		}
	}
</style>
