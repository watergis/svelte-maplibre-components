<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import SearchControl, { type SearchOption } from '$lib';

	let mapContainer: HTMLDivElement;
	let map: Map;

	// for Narok
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
		zoom: 17,
		maxItems: 25
		// sortItems: (a, b)=>{
		// 	return a.connno - b.connno
		// },
		// matchAllKeywords:false,
		// sortByMatchedKeywords:true
	};

	// for Nanyuki
	// let searchOption: SearchOption = {
	// 	url: 'https://nawasco.github.io/vt/meter.geojson',
	// 	target: ['accountno', 'serialno'],
	// 	format: (p) => {
	// 		const label: string[] = [];
	// 		const targets = ['accountno', 'serialno', 'category'];
	// 		targets.forEach((target) => {
	// 			if (p[target]) {
	// 				let text = p[target];
	// 				switch (target) {
	// 					case 'accountno':
	// 						text = `A/C: ${text}`;
	// 						break;
	// 					case 'serialno':
	// 						text = `S/N: ${text}`;
	// 						break;
	// 					default:
	// 						break;
	// 				}
	// 				label.push(text);
	// 			}
	// 		});
	// 		return label.length > 0 ? label.join(', ') : '';
	// 	},
	// 	place_type: ['meter'],
	// 	placeholder: 'Account No or S/N',
	// 	zoom: 16,
	// 	maxItems: 50,
	// 	sortItems: (a, b)=>{
	// 		return a.accountno - b.accountno
	// 	},
	// 	matchAllKeywords:false,
	// 	sortByMatchedKeywords:true
	// };

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			// for Narok
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
			// for Nanyuki
			// style: 'https://nawasco.github.io/mapbox-stylefiles/unvt/style-aerial-water.json'
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
