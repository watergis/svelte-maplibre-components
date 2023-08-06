<svelte:head>

<title>svelte-maplibre-tour | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-tour | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-tour | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-tour

[@watergis/svelte-maplibre-tour](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/tour) is a svelte component to add tourguide plugin for maplibre-gl.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-tour
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-tour
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-tour
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';

	import TourControl, { type TourGuideOptions } from '@watergis/svelte-maplibre-tour';

	let tourOptions: TourGuideOptions;

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});

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

<MenuControl bind:map position={'top-left'} bind:isMenuShown>
	<div slot="sidebar" class="primary-container">
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

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.primary-container {
		margin: 0.5rem;
	}
</style>
```
