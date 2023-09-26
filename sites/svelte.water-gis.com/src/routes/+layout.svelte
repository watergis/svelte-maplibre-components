<script lang="ts">
	import 'github-markdown-css/github-markdown-light.css';

	let isMenuOpened = false;

	let components = [
		{ name: 'attribute-popup', title: 'svelte-maplbre-attribute-popup' },
		{ name: 'attribute-table', title: 'svelte-maplbre-attribute-table' },
		{ name: 'export', title: 'svelte-maplbre-export' },
		{ name: 'legend', title: 'svelte-maplbre-legend' },
		{ name: 'measure', title: 'svelte-maplbre-measure' },
		{ name: 'menu', title: 'svelte-maplbre-menu' },
		{ name: 'search', title: 'svelte-maplbre-search' },
		{ name: 'share', title: 'svelte-maplbre-share' },
		{ name: 'style-switcher', title: 'svelte-maplbre-style-switcher' },
		{ name: 'tour', title: 'maplibre-gl-tour' },
		{ name: 'valhalla', title: 'svelte-maplbre-valhalla' },
		{ name: 'center-icon', title: 'maplibre-center-icon' },
		{ name: 'collapsible-panel', title: 'svelte-collapsible-panel' }
	];

	let description =
		'Documentation for svelte-maplibre-components packages powered by GIS for Water';
</script>

<svelte:head>
	<meta name="twitter:description" content={description} />
	<meta name="description" content={description} />

	<meta property="og:type" content="website" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://svelte-maplibre.water-gis.com/" />
	<meta property="og:image" content="/favicon.png" />
</svelte:head>

<nav class="navbar is-link" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
			<img src="https://raw.githubusercontent.com/watergis/logo/main/logo.svg" alt="logo" />
		</a>

		<!-- svelte-ignore a11y-missing-attribute -->
		<!-- svelte-ignore a11y-interactive-supports-focus -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<a
			role="button"
			class="navbar-burger {`${isMenuOpened ? 'is-active' : ''}`}"
			aria-label="menu"
			aria-expanded="false"
			data-target="navbar"
			on:click={() => (isMenuOpened = !isMenuOpened)}
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div id="navbar" class="navbar-menu {`${isMenuOpened ? 'is-active' : ''}`}">
		<div class="navbar-start">
			<a class="navbar-item" href="/" on:click={() => (isMenuOpened = false)}> Getting started </a>

			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link" href="/"> Components </a>

				<div class="navbar-dropdown">
					{#each components as component}
						<a
							class="navbar-item"
							href="/components/{component.name}"
							on:click={() => (isMenuOpened = false)}
						>
							{component.title}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</nav>

<main class="markdown-body main-content">
	<slot />
</main>

<footer class="footer">
	<div class="content has-text-centered">
		<p>
			<strong><a href="https://github.com/watergis" target="_blank">GIS for Water</a></strong> by
			<a href="https://github.com/JinIgarashi" target="_blank">Jin Igarashi</a>. The source code is
			licensed
			<a href="https://opensource.org/licenses/mit-license.php" target="_blank">MIT</a>. The website
			content is licensed
			<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>.
		</p>
	</div>
</footer>

<style lang="scss">
	@import 'bulma/bulma.sass';
	@import 'prismjs/themes/prism-dark.min.css';
	.main-content {
		margin: 1rem;
	}
</style>
