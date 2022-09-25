# svelte-maplibre-legend

This is a svelte component to make layer legend for maplibre-gl

## Usage

See [Example](./src/example).

```svelte
<script lang="ts">
  import LayerListPanel from '@watergis/LayerListPanel.svelte';

  // create maplibre.Map object
  let map = new Map();

  // set style for legend
  style = map.getStyle()

  // to set filter to enable to show only relative layers and alias of layer name
  let relativeLayers: { [key: string]: string } = {
    pipeline: 'Pipeline'
  };
</script>

<LayerListPanel bind:map {style} {relativeLayers} />
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
