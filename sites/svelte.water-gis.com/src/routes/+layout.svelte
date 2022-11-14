<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>maplibre components for svelte</title>
</svelte:head>

<Header />

<main>
	<slot />
</main>

<Footer />

<style lang="scss">
	@import 'prismjs/themes/prism-dark.min.css';
</style>
