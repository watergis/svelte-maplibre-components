# svelte-collapsible-panel

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![npm](https://img.shields.io/npm/v/@watergis/svelte-collapsible-panel)
![npm](https://img.shields.io/npm/dt/@watergis/svelte-collapsible-panel)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@watergis/svelte-collapsible-panel)

This is a svelte component for collapsible panel

## Install

```zsh
npm i @watergis/svelte-collapsible-panel
```

or

```zsh
yarn add @watergis/svelte-collapsible-panel
```

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
import { CollapsiblePanel } from '@watergis/svelte-collapsible-panel';

let isPanelOpen = true;

</script>

<CollapsiblePanel title={'Welcome to your library project'} color={'is-link'} bind:isPanelOpen>
	<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</CollapsiblePanel>
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
