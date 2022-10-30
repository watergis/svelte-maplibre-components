# svelte-maplibre-valhalla

This is a svelte component to add valhalla control for maplibre-gl

## Install

```zsh
npm i @watergis/svelte-maplibre-valhalla
```

or

```zsh
yarn add @watergis/svelte-maplibre-valhalla
```

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
import {
		ValhallaIsochronePanel,
		ValhallaRoutingPanel,
		type ValhallaIsochroneOptions,
		type ValhallaRoutingOptions
	} from '$lib';
// create maplibre.Map object
let map = new Map();

let valhallaUrl = 'https://valhalla.water-gis.com';
let valhallaIsochroneOptions: ValhallaIsochroneOptions = {
	Contours: [
		{
			time: 3,
			distance: 1,
			color: 'ff0000'
		},
		{
			time: 5,
			distance: 2,
			color: 'ffff00'
		},
		{
			time: 10,
			distance: 3,
			color: '0000ff'
		},
		{
			time: 15,
			distance: 4,
			color: 'ff00ff'
		}
	],
	isochrone: {
		font: ['Roboto Bold'],
		fontSize: 16,
		fontHalo: 1,
		fontColor: '#000000',
		fontHaloColor: '#fff'
	}
}
let valhallaRoutingOptions: ValhallaRoutingOptions = {
	font: ['Roboto Medium'],
	fontSize: 14,
	fontHalo: 3,
	fontColor: '#263238',
	fontHaloColor: '#fff',
	iconImage: 'marker',
	iconSize: 1
};

</script>

<ValhallaIsochronePanel
	bind:map={$map}
	bind:url={valhallaUrl}
	bind:options={valhallaIsochroneOptions}
	/>

<ValhallaRoutingPanel
	bind:map={$map}
	bind:url={valhallaUrl}
	bind:options={valhallaRoutingOptions}
	/>

<style>
@import 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css';
</style>
```

This library relies on Bulma CSS. Please import Bulma CSS from either NPM or CDN. For the Bulma CSS, further information can be found [here](https://bulma.io/documentation/overview/start/)

## create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

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

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
