<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import { faPalette, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
	import BackgroundEditor from './editor-panels/BackgroundEditor.svelte';
	import FillEditor from './editor-panels/FillEditor.svelte';
	import LineEditor from './editor-panels/LineEditor.svelte';
	import CircleEditor from './editor-panels/CircleEditor.svelte';
	import SymbolEditor from './editor-panels/SymbolEditor.svelte';
	import FillExtrusionEditor from './editor-panels/FillExtrusionEditor.svelte';
	import HillshadeEditor from './editor-panels/HillshadeEditor.svelte';
	import type SpriteLoader from './sprite';
	import RasterEditor from './editor-panels/RasterEditor.svelte';
	import HeatmapEditor from './editor-panels/HeatmapEditor.svelte';
	import Help from './util/Help.svelte';
	import ManualEditor from './editor-panels/ManualEditor.svelte';
	import { initTippy } from './util/initTippy';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/light.css';

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	let showManualEditor = false;
	export let selectedFormat: 'yaml' | 'json';

	const tippy = initTippy({
		placement: 'left',
		trigger: 'click',
		appendTo: document.body
	});
	let tooltipContent: HTMLElement;
</script>

<span
	tabindex="0"
	role="button"
	class="palette-button has-tooltip-left has-tooltip-arrow"
	data-tooltip="Change layer style"
	use:tippy={{ content: tooltipContent }}
>
	<Fa icon={faPalette} size="lg" />
</span>

<div class="tooltip" bind:this={tooltipContent}>
	<p class="title">
		{layer.type} editor

		<span
			role="button"
			class="manual-edit-button has-tooltip-right has-tooltip-arrow"
			data-tooltip="Manual editor"
			on:click={() => (showManualEditor = !showManualEditor)}
		>
			<Fa icon={faPenToSquare} size="lg" />
		</span>

		<Help bind:layerType={layer.type} />
	</p>
	<span role="button" class="close has-tooltip-bottom has-tooltip-arrow" data-tooltip="Close popup">
		<Fa icon={faCircleXmark} size="2x" color="#1c1c1c" />
	</span>
	<div class="editor-contents">
		{#if showManualEditor}
			<ManualEditor bind:map bind:layer bind:selectedFormat />
		{:else if layer.type === 'background'}
			<BackgroundEditor bind:map bind:layer />
		{:else if layer.type === 'fill'}
			<FillEditor bind:map bind:layer />
		{:else if layer.type === 'line'}
			<LineEditor bind:map bind:layer />
		{:else if layer.type === 'symbol'}
			<SymbolEditor bind:map bind:layer bind:spriteLoader />
		{:else if layer.type === 'circle'}
			<CircleEditor bind:map bind:layer />
		{:else if layer.type === 'fill-extrusion'}
			<FillExtrusionEditor bind:map bind:layer />
		{:else if layer.type === 'hillshade'}
			<HillshadeEditor bind:map bind:layer />
		{:else if layer.type === 'raster'}
			<RasterEditor bind:map bind:layer />
		{:else if layer.type === 'heatmap'}
			<HeatmapEditor bind:map bind:layer />
		{/if}
	</div>
	<div id="arrow" data-popper-arrow />
</div>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.palette-button {
		cursor: pointer;
		margin-right: 0.5rem;
	}

	.editor-contents {
		height: auto;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.tooltip {
		width: 300px;
		max-width: 300px;
		padding: 15px;
		position: relative;
		z-index: 9999;

		.title {
			margin: 0;
			margin-left: 0.5rem;
			font-size: medium;
			font-weight: bold;
			text-transform: capitalize;
			border-bottom: 2px solid gray;
		}

		.editor-contents {
			max-height: 90vh;
			overflow-y: auto;
		}

		.manual-edit-button {
			color: #1c1c1c;

			&:hover {
				color: hsl(204, 86%, 53%);
			}
		}

		.close {
			position: absolute;
			top: 0.5rem;
			right: 0.6rem;
			cursor: pointer;
		}
	}

	[data-tooltip]:hover:before,
	[data-tooltip]:hover:after,
	[data-tooltip]:focus:before,
	[data-tooltip]:focus:after {
		visibility: visible;
		opacity: 1;
	}

	:global(.tippy-content) {
		padding: 0 !important;
	}
</style>
