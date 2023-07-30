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

	const handleEnterKey = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			e.target.click();
		}
	};
</script>

<nav class="panel {color} my-1 mx-1">
	<div
		class="panel-heading p-2 header-menu"
		role="button"
		tabindex="0"
		on:click={() => (isPanelOpen = !isPanelOpen)}
		on:keydown={handleEnterKey}
	>
		<span class="panel-icon mt-1">
			{#if isPanelOpen}
				<Fa icon={faAngleDown} color="white" />
			{:else}
				<Fa icon={faAngleUp} color="white" />
			{/if}
		</span>
		{title}
	</div>
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
