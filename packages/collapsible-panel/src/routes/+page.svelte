<script lang="ts">
	import { CollapsiblePanel } from '$lib';

	let isPanelOpen = true;
</script>

<sveltekit:head>
	<title>Svelte collapsible panel example</title>
</sveltekit:head>

<CollapsiblePanel title={'Welcome to your library project'} color={'is-link'} bind:isPanelOpen>
	<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</CollapsiblePanel>
