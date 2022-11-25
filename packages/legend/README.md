# svelte-maplibre-legend

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-legend)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-maplibre-legend)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-maplibre-legend)

This is a svelte component to make layer legend for maplibre-gl

![demo.gif](./demo.gif)

## Install

```zsh
npm i @watergis/svelte-maplibre-legend
```

or

```zsh
yarn add @watergis/svelte-maplibre-legend
```

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
  import { LegendPanel, LegendHeader } from '@watergis/svelte-maplibre-legend';

  // create maplibre.Map object
  let map = new Map();

  // set style for legend
  style = map.getStyle()

  let onlyRendered = true
  let onlyRelative = true

  // to set filter to enable to show only relative layers and alias of layer name
  let relativeLayers: { [key: string]: string } = {
    pipeline: 'Pipeline'
  };
</script>

<div class="primary-container">
  <div class="legend-header">
    <LegendHeader bind:onlyRendered bind:onlyRelative {relativeLayers} />
  </div>
  <div class="legend-content">
    <LegendPanel bind:map={$map} {style} bind:onlyRendered bind:onlyRelative {relativeLayers} />
  </div>
</div>

<style>
  $height: calc(100vh - 56px);

	.primary-container {
		display: flex;
		flex-direction: column;
		position: relative;

		.legend-header {
			padding-left: 0.5rem;
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
		}

		.legend-content {
			overflow-x: hidden;
			overflow-y: auto;
			height: $height;
			width: 100%;
		}
	}
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
