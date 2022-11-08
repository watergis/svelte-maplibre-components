<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import SearchControl, { type SearchOption } from '$lib';

	let mapContainer: HTMLDivElement;
	let map: Map;

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
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<div class="map" bind:this={mapContainer} />
{#if map}
	<SearchControl bind:map {searchOption} position="top-left" />
{/if}

<style>
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
