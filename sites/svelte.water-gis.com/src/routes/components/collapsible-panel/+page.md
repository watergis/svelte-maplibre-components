<svelte:head>

<title>svelte-collapsible-panel | svelte-maplibre-components</title>
<meta name="twitter:title" content="svelte-collapsible-panel | svelte-maplibre-components" />
<meta property="og:title" content="svelte-collapsible-panel | svelte-maplibre-components" />

</svelte:head>

<script lang="ts">
  import Example from "./Example.svelte";
</script>

# @watergis/svelte-collapsible-panel

[@watergis/svelte-collapsible-panel](https://github.com/watergis/svelte-maplibre-components/tree/main/packages/collapsible-panel) is a svelte component to add collapsible panel.

## Demo

<Example />

## Usage

### Install the package

- Use npm

```
npm i @watergis/svelte-collapsible-panel
```

- Use yarn

```
yarn add @watergis/svelte-collapsible-panel
```

- Use pnpm

```
pnpm i @watergis/svelte-collapsible-panel
```

### Example

```svelte
<script lang="ts">
	import { CollapsiblePanel } from '@watergis/svelte-collapsible-panel';
	let isPanelOpen1 = true;
	let isPanelOpen2 = false;
	let isPanelOpen3 = false;
</script>

<CollapsiblePanel title={'Panel 1'} color={'is-link'} bind:isPanelOpen={isPanelOpen1}>
	<p>Panel content 1</p>
</CollapsiblePanel>
<CollapsiblePanel title={'Panel 2'} color={'is-success'} bind:isPanelOpen={isPanelOpen2}>
	<p>Panel content 2</p>
</CollapsiblePanel>
<CollapsiblePanel title={'Panel 3'} color={'is-warning'} bind:isPanelOpen={isPanelOpen3}>
	<p>Panel content 3</p>
</CollapsiblePanel>
```
