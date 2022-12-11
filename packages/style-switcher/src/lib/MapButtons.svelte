<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { Map } from 'maplibre-gl';
	import type { Position, StyleSwitcherOption } from './types';
	import MiniMapButton from './MiniMapButton.svelte';

	export let styles: StyleSwitcherOption[];
	export let map: Map;
	export let selectedStyle: StyleSwitcherOption;
	export let position: Position;

	const dispatch = createEventDispatcher();

	let mainContainer: HTMLDivElement;
	let isOptionsShown = false;

	const handleMainButtonClick = () => {
		isOptionsShown = !isOptionsShown;
	};

	const handleStyleChanged = (e: { detail: { style: StyleSwitcherOption } }) => {
		const next = e.detail.style;
		if (selectedStyle.title === next.title) return;
		map.setStyle(next.uri);
		map.on('styledata', () => {
			selectedStyle = next;
			dispatch('change', {
				style: next
			});
		});
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleMainButtonClick();
		}
	};
</script>

<div
	class="button-container"
	bind:this={mainContainer}
	on:mouseleave={() => (isOptionsShown = false)}
>
	<div
		role="button"
		on:click={handleMainButtonClick}
		on:keydown={handleKeydown}
		on:mouseenter={() => (isOptionsShown = true)}
	>
		<MiniMapButton bind:style={selectedStyle} bind:position isActive={true} />
	</div>

	{#if isOptionsShown}
		<div class="options">
			{#each styles as style}
				{#if selectedStyle.title !== style.title}
					<MiniMapButton bind:style bind:position on:change={handleStyleChanged} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.button-container {
		display: flex;

		.options {
			display: flex;
		}
	}
</style>
