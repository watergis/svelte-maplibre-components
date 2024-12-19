<svelte:head>

<title>svelte-maplibre-menu | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-maplibre-menu | svelte-maplibre-components" />
<meta property="og:title" content="svelte-maplibre-menu | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/svelte-maplibre-menu

[@watergis/svelte-maplibre-menu](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/menu) is a svelte component to add menu control for maplibre-gl.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-maplibre-menu
```

- Use yarn

```
yarn add @watergis/svelte-maplibre-menu
```

- Use pnpm

```
pnpm i @watergis/svelte-maplibre-menu
```

### Example

Use this package, importing fontawesome css is mandetory like

```js
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
```

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';

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

<MenuControl bind:map position={'top-right'} bind:isMenuShown>
	<div slot="sidebar" class="primary-container">
		<h4>Contents</h4>
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

if you want to use this control with specific height and width, there are also variables to set them as following example.

```svelte
<MenuControl bind:map position={'top-right'} bind:isMenuShown width={800} height={500}>
```

Use `sidebarOnLeft` property if you want to change sidebar location either left or right.

```svelte
<MenuControl bind:map position={'top-right'} bind:isMenuShown sidebarOnLeft={false}>
```

#### Split horizontally

If you want to split horizontally, please set `isHorizontal` as `true` value. If you set it to `true`, `sidebarOnLeft` option will be considered as `sidebarOnTop`. If you want to show primary container at the bottom, please set `sidebarOnLeft` as `false`. For Instance, the below code can show the container at the bottom horizontally.

```svelte
<MenuControl bind:map position={'top-right'} bind:isMenuShown sidebarOnLeft={false} isHorizontal={true}>
```

#### Change menu icon

As default, it uses `fa-bars`. You can change default icon to any other fontawesome icons as following example.

Using `faIconSize` prop, you can also change icon size from default's `nm` to other sizes.

```svelte
<script lang="ts">
import { MenuControl } from '@watergis/svelte-maplibre-menu';
import { faTable } from '@fortawesome/free-solid-svg-icons';
</script>

<MenuControl bind:map faIcon={faTable} faIconSize="lg">
```

Please also install fontawesome package by using the command of `pnpm i -D @fortawesome/free-solid-svg-icons`.

#### track container size changes

You can track changes for containers' size by following code.

```svelte
<script>
	const onChange = (e) => {
		const { percent, primarySize, splitterSize, secondarySize, dragging } = event.detail
	};
</script>

<MenuControl
	on:changed={onChange}>
```
