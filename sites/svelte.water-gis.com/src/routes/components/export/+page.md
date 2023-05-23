---
title: @watergis/svelte-maplibre-export
author: Jin Igarashi
---

<script lang="ts">
	import ExportExample from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-export

[@watergis/svelte-maplibre-export](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/export) is a svelte component to add export control to maplibre.

## Demo

<ExportExample />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-export
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-export
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-export
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MapExportControl, MapExportPanel } from '@watergis/svelte-maplibre-export';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});
</script>

<div class="map" bind:this={mapContainer}>
	<div class="export-container">
		<MapExportPanel bind:map showPrintableArea={false} showCrosshair={false} />
	</div>
</div>
<MapExportControl bind:map showPrintableArea={true} showCrosshair={true} isShownSetting={true} />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		width: 100%;
		height: 100%;
		z-index: 1;

		.export-container {
			position: absolute;
			top: 10px;
			left: 10px;
			z-index: 10;
		}
	}
</style>
```
