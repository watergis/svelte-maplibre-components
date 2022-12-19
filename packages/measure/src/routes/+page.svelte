<script lang="ts">
	import Map from '$example/Map.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		window.global = window;
		const Buffer = await (await import('buffer')).Buffer;
		window.Buffer = Buffer;
	});
</script>

<sveltekit:head>
	<title>Svelte maplibre measure example</title>
</sveltekit:head>

<Map />
