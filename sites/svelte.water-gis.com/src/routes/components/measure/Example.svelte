<script lang="ts">
	import { MeasurePanel, type MeasureOption } from '@watergis/svelte-maplibre-measure';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let isMenuShown = $state(true);

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();
	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let menuHeight = $derived(innerHeight * 0.6);
	let menuWidth = $derived(innerWidth * 0.95);

	let terrainRgbUrl = $state('https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png');
	let measureOption: MeasureOption = $state({
		tileSize: 512,
		font: ['Roboto Medium'],
		fontSize: 12,
		fontHalo: 1,
		mainColor: '#263238',
		haloColor: '#fff'
	});

	onMount(async () => {
		window.global = window;
		const Buffer = await (await import('buffer')).Buffer;
		window.Buffer = Buffer;

		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<MenuControl bind:map position={'top-right'} bind:isMenuShown width={menuWidth} height={menuHeight}>
	{#snippet sidebar()}
		<div class="primary-container">
			<h4>Measure tool with elevation enquiry</h4>
			<MeasurePanel bind:map bind:measureOption bind:terrainRgbUrl />
		</div>
	{/snippet}
	{#snippet mapControl()}
		<div>
			<div class="map" bind:this={mapContainer}></div>
		</div>
	{/snippet}
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.primary-container {
		margin: 0.5rem;
	}
</style>
