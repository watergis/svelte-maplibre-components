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

<div
	role="button"
	bind:this={mapContainer}
	class="map-button has-tooltip-text-centered {tooltipPosition}"
	style="border: {isActive ? '3px solid rgb(255, 119, 0)' : '1px solid gray'};position: {show
		? 'relative'
		: 'absolute'}"
	data-tooltip={style.title}
	tabindex="0"
	on:click={handleClick}
	on:keydown={handleKeydown}
/>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.map-button {
		box-sizing: border-box;
		cursor: pointer;
		width: 60px;
		height: 60px;
		margin: 0.1rem;
		z-index: 0;

		background: white;
		border-radius: 10px;
		-moz-border-radius: 10px;
		-webkit-border-radius: 10px;

		:global(.maplibregl-canvas) {
			border-radius: 8px;
			-moz-border-radius: 8px;
			-webkit-border-radius: 8px;
		}
	}
</style>
