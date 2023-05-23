# svelte-maplibre-menu

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-menu)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-maplibre-menu)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-maplibre-menu)

This is a svelte component to make menu for maplibre-gl

## Install

```zsh
npm i @watergis/svelte-maplibre-menu
```

or

```zsh
yarn add @watergis/svelte-maplibre-menu
```

## Usage

See [Example](./src/example).

```svelte
<script>
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	const map = new Map();

	import { faBars } from '@fortawesome/free-solid-svg-icons';
</script>

<MenuControl
	bind:map={$map}
	position={'top-left'}
	isMenuShown={true}
	sidebarOnLeft={true}
	isHorizontal={false}
	faIcon={faBars}
	faIconSize="nm"
>
	<div slot="sidebar">content</div>
	<div slot="menu">
		<div class="map" id="map" bind:this={mapContainer} />
	</div>
</MenuControl>

<style>
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

If you want to split horizontally, please set `isHorizontal` as `true` value. If you set it to `true`, `sidebarOnLeft` option will be considered as `sidebarOnTop`. If you want to show primary container at the bottom, please set `sidebarOnLeft` as `false`.

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
