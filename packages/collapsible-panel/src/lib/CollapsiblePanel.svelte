<script lang="ts">
	import './style/fa/css/all.css';

	export let title: string;

	export let isPanelOpen = false;
	export let color:
		| 'is-primary'
		| 'is-link'
		| 'is-info'
		| 'is-success'
		| 'is-warning'
		| 'is-danger'
		| '' = '';
</script>

<nav class="panel {color} my-1 mx-1">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<p class="panel-heading p-2 header-menu" on:click={() => (isPanelOpen = !isPanelOpen)}>
		<span class="panel-icon mt-1">
			{#if isPanelOpen}
				<i class="fas fa-angle-down" aria-hidden="true" style="color:white" />
			{:else}
				<i class="fas fa-angle-up" aria-hidden="true" style="color:white" />
			{/if}
		</span>
		{title}
	</p>
	{#if isPanelOpen}
		<div class="container m-2">
			<slot />
		</div>
	{/if}
</nav>

<style lang="scss">
	@import 'bulma/bulma.sass';

	.header-menu {
		cursor: pointer;
	}
</style>
