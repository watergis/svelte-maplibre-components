<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl, AttributionControl } from 'maplibre-gl';
	import { map } from '$example/stores';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import type { ElevationOption } from '$lib/types';
	import MeasurePanel from '$lib/MeasurePanel.svelte';

	let isMenuShown = true;

	let mapContainer: HTMLDivElement;

	let elevationOption: ElevationOption = {
		url: 'https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png',
		options: {
			tileSize: 512,
			font: ['Roboto Medium'],
			fontSize: 12,
			fontHalo: 1,
			mainColor: '#263238',
			haloColor: '#fff',
			units: 'kilometers'
		}
	};

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
</script>

<MenuControl bind:map={$map} position={'top-right'} bind:isMenuShown>
	<div slot="primary">
		<MeasurePanel bind:map={$map} bind:elevationOption />
	</div>
	<div slot="secondary">
		<div class="map" id="map" bind:this={mapContainer} />
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
