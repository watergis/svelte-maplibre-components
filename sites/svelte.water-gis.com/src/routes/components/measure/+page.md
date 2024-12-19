<svelte:head>

<title>svelte-maplibre-measure | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-measure | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-measure | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-measure

[@watergis/svelte-maplibre-measure](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/measure) is a svelte component to add measure control for maplibre-gl.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-measure
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-measure
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-measure
```

### Configuration on vite.config.ts

You might need to configure as follows.

```ts
import { onMount } from 'svelte';

onMount(async () => {
	window.global = window;
	const Buffer = await (await import('buffer')).Buffer;
	window.Buffer = Buffer;
});
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { MeasurePanel, type MeasureOption } from '@watergis/svelte-maplibre-measure';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	// put your terrain RGB URL
	let terrainRgbUrl = 'https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png';
	let measureOption: MeasureOption = {
		tileSize: 512,
		font: ['Roboto Medium'],
		fontSize: 12,
		fontHalo: 1,
		mainColor: '#263238',
		haloColor: '#fff'
	};

	onMount(async () => {
		window.global = window;
		const Buffer = await (await import('buffer')).Buffer;
		window.Buffer = Buffer;

		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	<div slot="sidebar" class="primary-container">
		<h4>Measure tool with elevation enquiry</h4>
		<MeasurePanel bind:map bind:measureOption bind:terrainRgbUrl />
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
