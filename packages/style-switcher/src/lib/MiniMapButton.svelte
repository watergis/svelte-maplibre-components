<script lang="ts">
	import { Map } from 'maplibre-gl';
	import { createEventDispatcher } from 'svelte';
	import type { Position, StyleSwitcherOption } from './types';

	export let style: StyleSwitcherOption;
	export let position: Position;
	export let isActive = false;
	export let show = false;

	$: tooltipPosition = ['top-right', 'top-left'].includes(position)
		? 'has-tooltip-bottom'
		: 'has-tooltip-top';

	const dispatch = createEventDispatcher();
	let mapContainer: HTMLDivElement;

	let map: Map;

	$: {
		if (style && mapContainer) {
			map = createMiniMap(mapContainer, style.uri);
		}
	}

	const createMiniMap = (div: HTMLDivElement, uri: string) => {
		if (!map) {
			map = new Map({
				container: div,
				style: uri,
				attributionControl: false,
				interactive: false
			});
		} else {
			map.setStyle(uri);
		}
		return map;
	};

	const handleClick = () => {
		dispatch('change', {
			style
		});
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleClick();
		}
	};
</script>

<div class="button-container" style="position: {show ? 'relative' : 'absolute'}">
	<div
		role="button"
		bind:this={mapContainer}
		class="map-button has-tooltip-text-centered {tooltipPosition}"
		style="border: {isActive ? '3px solid rgb(255, 119, 0)' : '1px solid gray'}"
		data-tooltip={style.title}
		tabindex="0"
		on:click={handleClick}
		on:keydown={handleKeydown}
	/>
</div>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.button-container {
		box-sizing: border-box;
		width: 60px;
		height: 60px;
		margin: 0.2rem;
		background-color: rgba(255, 255, 255, 1);
		z-index: 0;

		.map-button {
			cursor: pointer;
			width: 100%;
			height: 100%;
			border-style: solid;
			border-color: gray;
			border-width: 2px;
			background: white;
		}
	}
</style>
