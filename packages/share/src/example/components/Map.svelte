<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl, AttributionControl } from 'maplibre-gl';
	import { map } from '$example/stores';
	import ShareUrlControl from '$lib/ShareURLControl.svelte';

	let mapContainer: HTMLDivElement;

	onMount(async () => {
		const map2 = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
			center: { lng: 35.87063, lat: -1.08551 },
			zoom: 13,
			hash: true,
			attributionControl: false
		});
		map2.addControl(
			new NavigationControl({
				visualizePitch: false,
				showZoom: true,
				showCompass: true
			}),
			'top-right'
		);
		map2.addControl(new AttributionControl({ compact: true }), 'bottom-right');

		map.update(() => map2);
	});

	let customiseUrl = (url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('customise', 'true');
		return _url.toString();
	};
</script>

<div class="map-wrap">
	<div class="map" id="map" bind:this={mapContainer} />
	<ShareUrlControl bind:map={$map} bind:customiseUrl />
</div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map-wrap {
		position: relative;
		width: 100%;
		height: calc(100vh);
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
