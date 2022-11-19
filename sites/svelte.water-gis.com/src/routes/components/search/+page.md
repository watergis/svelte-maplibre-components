---
title: @watergis/svelte-maplibre-search
author: Jin Igarashi
---

<script lang="ts">
	import SearchExample from "$lib/components/SearchExample.svelte";
</script>

# @watergis/svelte-maplibre-search

[@watergis/svelte-maplibre-search](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/search) is a svelte component to add search control to maplibre.

## Demo

<SearchExample />

## Usage

### Install the package

- Use npm
```
npm i @watergis/svelte-maplibre-search
```

- Use yarn
```
yarn add @watergis/svelte-maplibre-search
```

- Use pnpm
```
pnpm i @watergis/svelte-maplibre-search
```

### Example

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { Map } from 'maplibre-gl';
  import SearchControl, { type SearchOption } from '@watergis/svelte-maplibre-search';

  let mapContainer: HTMLDivElement;
  // create maplibre.Map object
  let map = new Map();

  let searchOption: SearchOption = {
    url: 'https://narwassco.github.io/vt/meter.geojson',
    target: ['connno', 'serialno', 'village'],
    format: (p) => {
      const label: string[] = [];
      const targets = ['connno', 'serialno', 'village'];
      targets.forEach((target) => {
        if (p[target]) label.push(p[target]);
      });
      return label.length > 0 ? label.join(', ') : '';
    },
    place_type: ['meter'],
    placeholder: 'Search CONN NO or S/N',
    zoom: 17
  };

  onMount(async () => {
    map = new Map({
      container: mapContainer,
      style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
    });
  });

</script>

<div class="map" bind:this={mapContainer} />
{#if map}
  <SearchControl bind:map {searchOption} position="top-left" />
{/if}

<style lang="scss">
  @import 'maplibre-gl/dist/maplibre-gl.css';

  .map {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
```
