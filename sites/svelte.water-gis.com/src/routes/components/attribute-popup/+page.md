---
title: @watergis/svelte/maplibre-attribute-popup
author: Jin Igarashi
---

<script lang="ts">
	import AtttributePopupExample from "$lib/components/AtttributePopupExample.svelte";
</script>

# @watergis/svelte/maplibre-attribute-popup

[@watergis/svelte/maplibre-attribute-popup](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/attribute-popup) is a svelte component to add attribute popup plugin to maplibre.

## Demo

<AtttributePopupExample />

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

### Example of source code

```svelte
<script lang="ts">
  import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';

  // create maplibre.Map object
  let map = new Map();

  // filter layers to show attribute popup
  // show all layers' attributes if targetLayers is not specified.
  let targetLayers = [
    'meter',
    'flow meter',
    'valve',
    'washout',
  ];

</script>

<AttributePopupControl bind:map {targetLayers} />

<style>
  @import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>
```
