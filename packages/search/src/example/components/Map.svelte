<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl, AttributionControl } from 'maplibre-gl';
	import { map } from '$example/stores';
	import SearchControl, { type SearchOption } from '$lib';

	let mapContainer: HTMLDivElement;

	let searchOption: SearchOption = {
		url: 'https://narwassco.github.io/vt/meter.geojson',
		target: ['connno', 'serialno', 'village'],
		format: (p) => {
			const label: string[] = [];
			const targets = ['connno', 'serialno', 'village'];
			targets.forEach((target) => {
				if (p[target]) label.push(p[target]);
			});
			return label.length > 0 ? label.join(', ') : '';
		},
		place_type: ['meter'],
		placeholder: 'Search CONN NO or S/N',
		zoom: 17
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

<div class="map-wrap">
	<div class="map" id="map" bind:this={mapContainer} />
	{#if $map}
		<SearchControl bind:map={$map} {searchOption} position="top-left" />
	{/if}
</div>

<style>
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
