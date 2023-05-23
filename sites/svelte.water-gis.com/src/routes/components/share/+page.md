<svelte:head>

<title>svelte-maplibre-share | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-share | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-share | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
	import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-share

[@watergis/svelte-maplibre-share](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/share) is a svelte component to add URL sharing control to maplibre.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-share
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-share
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-share
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});

	let customiseUrl = (url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('customise', 'true');
		return _url.toString();
	};
</script>

<div class="map" bind:this={mapContainer} />
<ShareURLControl bind:map bind:customiseUrl />

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>
```
