<script lang="ts">
	let isMenuOpened = false;
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
			<a class="navbar-item" href="/"> Getting started </a>

			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link"> Components </a>

				<div class="navbar-dropdown">
					<a class="navbar-item" href="/components/attribute-popup">
						svelte-maplbre-attribute-popup
					</a>
					<a class="navbar-item" href="/components/center-icon"> maplbre-center-icon </a>
				</div>
			</div>
		</div>
	</div>
</nav>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
