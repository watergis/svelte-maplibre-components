<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import debounce from 'debounce';
	import type { Map } from 'maplibre-gl';
	import MiniMapButton from './MiniMapButton.svelte';
	import type { Position, StyleSwitcherOption } from './types';

	export let styles: StyleSwitcherOption[];
	export let map: Map;
	export let selectedStyle: StyleSwitcherOption;
	export let position: Position;

	const dispatch = createEventDispatcher();

	let mainContainer: HTMLDivElement;
	let isOptionsShown = false;

	const handleMainButtonClick = debounce(() => {
		isOptionsShown = !isOptionsShown;
	}, 300);

	const handleStyleChanged = (e: { detail: { style: StyleSwitcherOption } }) => {
		const next = e.detail.style;
		if (selectedStyle.title === next.title) return;
		map.setStyle(next.uri);
		map.on('styledata', () => {
			selectedStyle = next;
			isOptionsShown = false;
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
	role="button"
	tabindex="0"
	bind:this={mainContainer}
	on:mouseleave={() => (isOptionsShown = false)}
>
	<div
		role="button"
		tabindex="0"
		class="main-button"
		on:click={handleMainButtonClick}
		on:keydown={handleKeydown}
		on:mouseenter={handleMainButtonClick}
	>
		<MiniMapButton bind:style={selectedStyle} bind:position isActive={true} />
	</div>

	<div class="options" style="margin-left: {isOptionsShown ? '63px' : '0'}">
		{#each styles as style}
			{#if selectedStyle.title !== style.title}
				<MiniMapButton
					bind:style
					bind:position
					bind:show={isOptionsShown}
					on:change={handleStyleChanged}
				/>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	.button-container {
		display: flex;

		.main-button {
			z-index: 1;
		}

		.options {
			position: relative;
			display: flex;
		}
	}
</style>
