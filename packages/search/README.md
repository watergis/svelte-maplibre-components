# svelte-maplibre-search

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-search)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-maplibre-search)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-maplibre-search)

This is a svelte component to add search control plugin to maplibre.

## Install

```zsh
npm i @watergis/svelte-maplibre-search
```

or

```zsh
yarn add @watergis/svelte-maplibre-search
```

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
import AttributePopupControl from '@watergis/svelte-maplibre-search';

// create maplibre.Map object
let map = new Map();

// Options
let searchOption: SearchOption = {
    // specify URL's for geojson to search
    url: 'https://narwassco.github.io/vt/meter.geojson',
    // specify properties which will be used for search
    target: ['connno', 'serialno', 'village'],
    // create formula to customise label format
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
</script>

{#if map}
  <SearchControl bind:map={$map} {searchOption} position="top-left" />
{/if}

<style>
  @import 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css';
</style>
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
