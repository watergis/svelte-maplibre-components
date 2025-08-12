<svelte:head>

<title>svelte-maplibre-valhalla | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-valhalla | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-valhalla | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-valhalla

[@watergis/svelte-maplibre-valhalla](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/valhalla) is a svelte component to add routing and isochrone controls of valhalla for maplibre-gl.

In order to use this control, you need to prepare your own valhalla server. The valhalla server which the example uses is only supporting the area of Kenya and Rwanda. Please follow the [instruction](https://water-gis.com/en/setups/valhalla/) to setup your server in advance.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-valhalla
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-valhalla
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-valhalla
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import {
		ValhallaIsochronePanel,
		ValhallaRoutingPanel,
		type ValhallaIsochroneOptions,
		type ValhallaRoutingOptions
	} from '@watergis/svelte-maplibre-valhalla';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	let valhallaUrl = 'https://valhalla.water-gis.com';
	// set options for valhalla isochrone feature
	let valhallaIsochroneOptions: ValhallaIsochroneOptions = {
		Contours: [
			{
				time: 3,
				distance: 1,
				color: 'ff0000'
			},
			{
				time: 5,
				distance: 2,
				color: 'ffff00'
			},
			{
				time: 10,
				distance: 3,
				color: '0000ff'
			},
			{
				time: 15,
				distance: 4,
				color: 'ff00ff'
			}
		],
		isochrone: {
			font: ['Roboto Bold'],
			fontSize: 16,
			fontHalo: 1,
			fontColor: '#000000',
			fontHaloColor: '#fff'
		}
	};
	// set options for valhalla routing feature
	let valhallaRoutingOptions: ValhallaRoutingOptions = {
		font: ['Roboto Medium'],
		fontSize: 14,
		fontHalo: 3,
		fontColor: '#263238',
		fontHaloColor: '#fff',
		iconImage: 'marker',
		iconSize: 1
	};

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	<div slot="sidebar" class="primary-container">
		<h3>Isochrone tool</h3>
		<ValhallaIsochronePanel bind:map url={valhallaUrl} options={valhallaIsochroneOptions} />
		<hr />
		<h3>Routing tool</h3>
		<ValhallaRoutingPanel bind:map url={valhallaUrl} options={valhallaRoutingOptions} />
	</div>
	<div slot="mapControl">
		<div class="map" bind:this={mapContainer} />
	</div>
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

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
