# svelte-maplibre-measure

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-measure)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-maplibre-measure)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-maplibre-measure)

This is a svelte component to add measure control for maplibre-gl

## Install

```zsh
npm i @watergis/svelte-maplibre-measure
```

or

```zsh
yarn add @watergis/svelte-maplibre-measure
```

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
import { MeasurePanel, type MeasureOption} from '$lib';

// create maplibre.Map object
let map = new Map();

// set URL for your terrain RGB
let terrainRgbUrl = 'https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png'

// set Options
let measureOption: MeasureOption = {
    tileSize: 512,
    font: ['Roboto Medium'],
    fontSize: 12,
    fontHalo: 1,
    mainColor: '#263238',
    haloColor: '#fff',
};
</script>

<!-- You can skip terrainRgbUrl if you don't have terrain RGB data -->
<MeasurePanel bind:map={$map} bind:measureOption bind:terrainRgbUrl />
```

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
