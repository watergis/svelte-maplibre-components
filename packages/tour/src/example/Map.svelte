<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, { Map, NavigationControl } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import * as pmtiles from 'pmtiles';
	import '@sjmc11/tourguidejs/dist/css/tour.min.css';
	import '$lib/maplibre-tour-control.css';

	let protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	import {
		MaplibreTourControl,
		type TourGuideOptions,
		type MaplibreTourControlOptions
	} from '$lib';

	let tourOptions: TourGuideOptions = { rememberStep: true };

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});

		map.addControl(new NavigationControl());

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

		tourOptions.steps = steps;

		const controlOption: MaplibreTourControlOptions = {
			localStorageKey: new Date().toDateString,
			showTourAsDefault: true
		};

		map.addControl(new MaplibreTourControl(tourOptions, controlOption), 'top-right');
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
	</div>
</MenuControl>

<style>
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

	.container {
		padding: 1rem;
	}
</style>
