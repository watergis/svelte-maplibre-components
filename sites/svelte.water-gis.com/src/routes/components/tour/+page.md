<svelte:head>

<title>svelte-maplibre-tour | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-tour | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-tour | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/maplibre-gl-tour

[@watergis/maplibre-gl-tour](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/tour) is to add tourguide plugin for maplibre-gl.

## Demo

<Example />

## Usage

### Install dependency

```
npm i -D @sjmc11/tourguidejs
```

### Install the package

- Use npm

```
npm i @watergis/maplibre-gl-tour
```

- Use yarn

```
yarn add @watergis/maplibre-gl-tour
```

- Use pnpm

```
pnpm i @watergis/maplibre-gl-tour
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, { Map, NavigationControl } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';

	import * as pmtiles from 'pmtiles';

	let protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	let isMenuShown = true;

	let mapContainer: HTMLDivElement;
	let map: Map;
	let innerHeight = 0;
	let innerWidth = 0;

	$: menuHeight = innerHeight * 0.8;
	$: menuWidth = innerWidth * 0.95;

	import { MaplibreTourControl, type TourGuideOptions } from '@watergis/maplibre-gl-tour';
	import '@sjmc11/tourguidejs/dist/css/tour.min.css';
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

		map.addControl(new MaplibreTourControl(tourOptions), 'top-right');
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<MenuControl bind:map position={'top-left'} bind:isMenuShown width={menuWidth} height={menuHeight}>
	<div slot="sidebar" class="primary-container" style="height:{menuHeight - 50}px;">
		<h1 class="one">content 1</h1>
		<h2 class="two">content 2</h2>
		<h3 class="three">content 3</h3>
	</div>
	<div slot="mapControl">
		<div class="map" bind:this={mapContainer} />
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

	.primary-container {
		margin: 0.5rem;
		overflow-y: auto;
	}
</style>
```
