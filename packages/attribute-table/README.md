# @watergis/svelte-maplibre-attribute-table

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-attribute-table)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-maplibre-attribute-table)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-maplibre-attribute-table)

This is a svelte component to add attribute table plugin to maplibre.

## Install

```zsh
npm i @watergis/svelte-maplibre-attribute-table
```

or

```zsh
yarn add @watergis/svelte-maplibre-attribute-table
```

## Usage

See [Example](./src/example).

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

<AttributeTableControl bind:map position="top-right" rowsPerPage="25" minZoom="14">
	<div class="map" bind:this={mapContainer} />
</AttributeTableControl>
```

## create-svelte

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

### Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

### Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

### Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
