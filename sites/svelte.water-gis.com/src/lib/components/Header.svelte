<script lang="ts">
	let isMenuOpened = false;

	let components = [
		{ name: 'attribute-popup', title: 'svelte-maplbre-attribute-popup' },
		{ name: 'export', title: 'svelte-maplbre-export' },
		{ name: 'legend', title: 'svelte-maplbre-legend' },
		{ name: 'measure', title: 'svelte-maplbre-measure' },
		{ name: 'menu', title: 'svelte-maplbre-menu' },
		{ name: 'search', title: 'svelte-maplbre-search' },
		{ name: 'share', title: 'svelte-maplbre-share' },
		{ name: 'style-switcher', title: 'svelte-maplbre-style-switcher' },
		{ name: 'valhalla', title: 'svelte-maplbre-valhalla' },
		{ name: 'center-icon', title: 'maplibre-center-icon' },
		{ name: 'collapsible-panel', title: 'svelte-collapsible-panel' }
	];
</script>

<nav class="navbar is-link" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="https://github.com/watergis/svelte-maplibre-components">
			<img src="https://raw.githubusercontent.com/watergis/logo/main/logo.svg" />
		</a>

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
				<a class="navbar-link"> Components </a>

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

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
