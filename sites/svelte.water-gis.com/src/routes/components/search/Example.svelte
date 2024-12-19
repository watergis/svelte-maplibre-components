<script lang="ts">
	import SearchControl, { type SearchOption } from '@watergis/svelte-maplibre-search';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();

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

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<div class="map" bind:this={mapContainer}></div>
<SearchControl bind:map {searchOption} position="top-left" />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.map {
		display: inline-block;
		text-align: left;
		width: 100%;
		height: $height;
		z-index: 1;
	}
</style>
