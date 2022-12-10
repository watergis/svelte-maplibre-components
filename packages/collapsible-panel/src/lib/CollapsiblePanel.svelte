<script lang="ts">
	import Fa from 'svelte-fa';
	import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

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
				<Fa icon={faAngleDown} color="white" />
			{:else}
				<Fa icon={faAngleUp} color="white" />
			{/if}
		</span>
		{title}
	</p>
	<div class="container m-2" hidden={!isPanelOpen}>
		<slot />
	</div>
</nav>

<style lang="scss">
	@import 'bulma/bulma.sass';

	.header-menu {
		cursor: pointer;
	}
</style>
