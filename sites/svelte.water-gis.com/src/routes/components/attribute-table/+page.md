<svelte:head>

<title>svelte-maplibre-attribute-table | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-attribute-table | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-attribute-table | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
	import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-attribute-table

[@watergis/svelte-maplibre-attribute-table](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/attribute-table) is a svelte component to add attribute table plugin to maplibre.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-attribute-table
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-attribute-table
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-attribute-table
```

### Example

Use this package, importing fontawesome css is mandetory like

```js
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
```

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl } from 'maplibre-gl';
	import AttributeTableControl from '@watergis/svelte-maplibre-attribute-table';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(() => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json',
			hash: true
		});

		map.addControl(new NavigationControl(), 'top-right');
	});
</script>

<AttributeTableControl bind:map position="top-right" rowsPerPage={50} minZoom={14}>
	<div class="map" bind:this={mapContainer} />
</AttributeTableControl>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
```
