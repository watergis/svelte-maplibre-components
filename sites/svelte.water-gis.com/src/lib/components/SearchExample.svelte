<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import SearchControl, { type SearchOption } from '@watergis/svelte-maplibre-search';

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
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<div class="container">
	<div class="map" bind:this={mapContainer} />
	{#if map}
		<SearchControl bind:map {searchOption} position="top-left" />
	{/if}
</div>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.container {
		text-align: center;

		.map {
			display: inline-block;
			text-align: left;
			width: 95%;
			height: $height;
			z-index: 1;
		}
	}
</style>
