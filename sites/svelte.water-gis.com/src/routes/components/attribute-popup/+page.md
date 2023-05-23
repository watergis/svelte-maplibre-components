<svelte:head>

<title>svelte-maplibre-attribute-popup | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-attribute-popup | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-attribute-popup | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
	import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-attribute-popup

[@watergis/svelte-maplibre-attribute-popup](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/attribute-popup) is a svelte component to add attribute popup plugin to maplibre.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-attribute-popup
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-attribute-popup
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-attribute-popup
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	// filter layers to show attribute popup
	// show all layers' attributes if targetLayers is not specified.
	let targetLayers = ['meter', 'flow meter', 'valve', 'washout'];

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<div class="map" bind:this={mapContainer} />
<AttributePopupControl bind:map {targetLayers} />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
```
