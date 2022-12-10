<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Map } from 'maplibre-gl';
	import type { Position, StyleSwitcherOption } from './types';

	export let styles: StyleSwitcherOption[];
	export let map: Map;
	export let selectedStyle: StyleSwitcherOption;
	export let position: Position;

	$: tooltipPosition = ['top-right', 'bottom-right'].includes(position)
		? 'has-tooltip-left'
		: 'has-tooltip-right';

	const dispatch = createEventDispatcher();

	let mainContainer: HTMLDivElement;
	let miniMap: Map;

	let nextStyle: StyleSwitcherOption;

	$: {
		if (selectedStyle && mainContainer) {
			nextStyle = getNextStyle();
			miniMap = createMiniMap(mainContainer, nextStyle.uri);
		}
	}

	const getNextStyle = () => {
		const index = styles.findIndex((s) => s.title === selectedStyle.title);
		let style = styles[0];
		if (index < styles.length - 1) {
			style = styles[index + 1];
		}
		return style;
	};

	const createMiniMap = (div: HTMLDivElement, uri: string) => {
		if (!miniMap) {
			miniMap = new Map({
				container: div,
				style: uri,
				attributionControl: false,
				interactive: false
			});
		} else {
			miniMap.setStyle(uri);
		}
		return miniMap;
	};

	const changeStyle = (next: StyleSwitcherOption) => {
		if (selectedStyle.title === next.title) return;
		map.setStyle(next.uri);
		map.on('styledata', () => {
			selectedStyle = next;
			dispatch('change', {
				style: selectedStyle
			});
		});
	};
</script>

<div
	bind:this={mainContainer}
	class="map-button {tooltipPosition} has-tooltip-arrow has-tooltip-info"
	data-tooltip={nextStyle?.title}
	on:click={() => {
		changeStyle(nextStyle);
	}}
/>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.map-button {
		cursor: pointer;
		width: 60px;
		height: 60px;
		border-radius: 30px;
		-moz-border-radius: 30px;
		-webkit-border-radius: 30px;
		border-style: solid;
		border-color: gray;
		border-width: 2px;
		background: white;
		box-shadow: 5px 5px 5px #999;

		:global(.maplibregl-canvas) {
			width: 60px;
			height: 60px;
			border-radius: 30px;
			-moz-border-radius: 30px;
			-webkit-border-radius: 30px;
		}
	}
</style>
