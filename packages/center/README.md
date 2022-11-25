# maplibre-center-icon

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/maplibre-center-icon)
![npm](https://img.shields.io/npm/dt/@watergis/maplibre-center-icon)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/maplibre-center-icon)

This is a library to add center icon to maplibre.

## Install

```zsh
npm i @watergis/maplibre-center-icon
```

or

```zsh
yarn add @watergis/maplibre-center-icon
```

## Usage

See [Example](./src/example).

```ts
import CenterIconManager from '@watergis/maplibre-center-icon';

// create maplibre.Map object
let map = new Map();

// create center icon
centerIconManager = new CenterIconManager(map);
centerIconManager.create();
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
