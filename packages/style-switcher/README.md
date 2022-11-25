# svelte-maplibre-style-switcher

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-style-switcher)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-maplibre-style-switcher)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-maplibre-style-switcher)

This is a svelte component to add style switch component for maplibre-gl

## Install

```zsh
npm i @watergis/svelte-maplibre-style-switcher
```

or

```zsh
yarn add @watergis/svelte-maplibre-style-switcher
```

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
import { StyleSwitcher, StyleUrl, type StyleSwitcherOption } from '$lib';

let styles: StyleSwitcherOption[] = [
    {
        title: 'UNVT Water (OSM)',
        uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
    },
    {
        title: 'UNVT Water (Building)',
        uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-buildings.json`
    }
];
let selectedStyle: StyleSwitcherOption = styles[0];

// to load initial style from URL
const styleUrlObj = new StyleUrl();
selectedStyle = styleUrlObj.getInitialStyle(styles);
</script>

<StyleSwitcher bind:map bind:styles bind:selectedStyle />
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
