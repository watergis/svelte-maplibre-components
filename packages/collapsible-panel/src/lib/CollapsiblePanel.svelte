<script lang="ts">
	import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	interface Props {
		title: string;
		isPanelOpen?: boolean;
		color?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger' | '';
		children?: import('svelte').Snippet;
	}

	let { title, isPanelOpen = $bindable(false), color = '', children }: Props = $props();

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
		onclick={() => (isPanelOpen = !isPanelOpen)}
		onkeydown={handleEnterKey}
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
		{@render children?.()}
	</div>
</nav>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.header-menu {
		cursor: pointer;
	}
</style>
