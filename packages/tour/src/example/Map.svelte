<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, { Map, NavigationControl } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import * as pmtiles from 'pmtiles';

	let protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	import TourControl, { type TourGuideOptions } from '$lib';

	let tourOptions: TourGuideOptions;

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});

		map.addControl(new NavigationControl());

		// tourguide needs to be generated after some times
		// because all html elements have to be ready prior to tourgude component being initialised
		setTimeout(() => {
			// You can get maplibre control button as follows
			const topLeftTools = document.querySelectorAll('.maplibregl-ctrl-top-left .maplibregl-ctrl');
			const menuButton = topLeftTools.item(0);

			// target of steps can be refered to ID, class name, DOM element, and so on.
			// see the library documentation here: https://tourguidejs.com/docs/steps.html#steps-array
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
					target: menuButton,
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
		}, 100);
	});
</script>

<MenuControl
	bind:map
	position={'top-left'}
	isMenuShown={true}
	sidebarOnLeft={true}
	isHorizontal={false}
>
	<div slot="sidebar" class="container">
		<h1 class="one">content 1</h1>
		<h2 class="two">content 2</h2>
		<h3 class="three">content 3</h3>
	</div>
	<div slot="map">
		<div class="map" bind:this={mapContainer} />

		<!-- In this example, TourControl component will be initialised after tourOptions variable is set -->
		<!-- Set unique localStorageKey name for the tour This is important to remember tour completion state in local storage -->
		<!-- For this example, timestamp is added to storage key because the tour want to be shown always as an example -->
		{#if tourOptions}
			<TourControl
				bind:map
				bind:tourguideOptions={tourOptions}
				localStorageKey={`svelte-maplibre-tour-example-${new Date().toISOString()}`}
			/>
		{/if}
	</div>
</MenuControl>

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

	.container {
		padding: 1rem;
	}
</style>
