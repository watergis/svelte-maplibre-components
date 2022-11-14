<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import 'github-markdown-css/github-markdown.css';
</script>

<svelte:head>
	<title>maplibre components for svelte</title>
</svelte:head>

<Header />

<main class="markdown-body main-content">
	<slot />
</main>

<Footer />

<style lang="scss">
	@import 'prismjs/themes/prism-dark.min.css';
	.main-content {
		margin: 1rem;
	}
</style>
