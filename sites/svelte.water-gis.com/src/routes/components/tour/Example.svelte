<script lang="ts">
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let isMenuShown = $state(true);

	let mapContainer: HTMLDivElement = $state();
	let map: Map = $state();
	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let menuHeight = $derived(innerHeight * 0.8);
	let menuWidth = $derived(innerWidth * 0.95);

	import '@sjmc11/tourguidejs/dist/css/tour.min.css';
	import { MaplibreTourControl, type TourGuideOptions } from '@watergis/maplibre-gl-tour';
	import '@watergis/maplibre-gl-tour/dist/maplibre-tour-control.css';

	let tourOptions: TourGuideOptions;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();

		const steps = [
			{
				title: 'Welcome to svelte maplibre tour!',
				content: `This tutorial is going to take you around the main features of the application. <br> Let's begin!`,
				target: document.body,
				order: 1
			},
			{
				title: 'Sidemenu button',
				content: `Side menu can be opened or closed by clicking this button`,
				target: '.maplibregl-ctrl-menu',
				order: 2
			},
			{
				title: 'Header 1',
				content: `This is header 1.`,
				target: '.one',
				order: 3
			},
			{
				title: 'Header 2',
				content: `This is header 2.`,
				target: '.two',
				order: 4
			},
			{
				title: 'Header 3',
				content: `This is header 3.`,
				target: '.three',
				order: 5
			}
		];

		tourOptions = { steps, rememberStep: true };

		map.addControl(new MaplibreTourControl(tourOptions, {}), 'top-right');
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<MenuControl bind:map position="top-left" bind:isMenuShown width={menuWidth} height={menuHeight}>
	{#snippet sidebar()}
		<div class="primary-container" style="height:{menuHeight - 50}px;">
			<h1 class="one">content 1</h1>
			<h2 class="two">content 2</h2>
			<h3 class="three">content 3</h3>
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
		overflow-y: auto;
	}
</style>
