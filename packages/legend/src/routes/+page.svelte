<script lang="ts">
	import Content from '$example/components/Content.svelte';
	import Map from '$example/components/Map.svelte';
</script>

<sveltekit:head>
	<title>Svelte maplibre legend example</title>
</sveltekit:head>

<Content>
	<Map />
</Content>

<style>
	@import 'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css';
</style>
