---
title: @watergis/svelte-maplibre-measure
author: Jin Igarashi
---

<script lang="ts">
  import MeasureExample from "$lib/components/MeasureExample.svelte";
</script>

# @watergis/svelte-maplibre-measure

[@watergis/svelte-maplibre-measure](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/measure) is a svelte component to add measure control for maplibre-gl.

## Demo

<MeasureExample />

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
    map = new Map({
      container: mapContainer,
      style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
    });
  });

</script>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
  <div slot="primary" class="primary-container">
    <h4>Measure tool with elevation enquiry</h4>
    <MeasurePanel bind:map bind:measureOption bind:terrainRgbUrl />
  </div>
  <div slot="secondary">
    <div class="map" bind:this={mapContainer} />
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
