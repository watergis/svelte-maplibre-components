<svelte:head>

<title>svelte-maplibre-style-switcher | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-style-switcher | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-style-switcher | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-style-switcher

[@watergis/svelte-maplibre-style-switcher](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/style-switcher) is a svelte component to add style switch control for maplibre-gl.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-style-switcher
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-style-switcher
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-style-switcher
```

### Example

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import {
		StyleSwitcher,
		StyleUrl,
		type StyleSwitcherOption
	} from '@watergis/svelte-maplibre-style-switcher';

	let mapContainer: HTMLDivElement;
	// create maplibre.Map object
	let map = new Map();

	let styles: StyleSwitcherOption[] = [
		{
			title: 'UNVT Water (OSM)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
		},
		{
			title: 'Satellite Water',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json`
		}
	];
	let selectedStyle: StyleSwitcherOption = styles[0];

	onMount(async () => {
		const styleUrlObj = new StyleUrl();
		selectedStyle = styleUrlObj.getInitialStyle(styles);

		map = new Map({
			container: mapContainer,
			style: selectedStyle.uri
		});
	});
</script>

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	<div slot="sidebar" class="primary-container">
		<h4>Style switch control</h4>
		<!-- control to add select box for map styles -->
		<StyleSwitcher bind:map bind:styles bind:selectedStyle />
	</div>
	<div slot="mapControl">
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
