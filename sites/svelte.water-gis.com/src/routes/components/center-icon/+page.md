---
title: @watergis/maplibre-center-icon
author: Jin Igarashi
---

<script lang="ts">
  import CenterIconExample from "./Example.svelte";
</script>

# @watergis/maplibre-center-icon

[@watergis/maplibre-center-icon](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/center) is to add center icon to maplibre.

## Demo

<CenterIconExample />

## Usage

### Install the package

- Use npm

```
npm i @watergis/maplibre-center-icon
```

- Use yarn

```
yarn add@watergis/maplibre-center-icon
```

- Use pnpm

```
pnpm i @watergis/maplibre-center-icon
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import CenterIconManager from '@watergis/maplibre-center-icon';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		const centerIconManager = new CenterIconManager(map);
		centerIconManager.create();
	});
</script>

<div class="map" bind:this={mapContainer} />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
```
