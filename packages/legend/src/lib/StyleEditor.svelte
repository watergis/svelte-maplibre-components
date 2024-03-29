<script lang="ts">
	import { faCircleXmark, faPalette, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
	import type { LayerSpecification } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/light.css';
	import { getLayerIdContext } from './Layer.svelte';
	import Legend from './Legend.svelte';
	import { getMapContext } from './LegendPanel.svelte';
	import {
		BackgroundEditor,
		CircleEditor,
		FillEditor,
		FillExtrusionEditor,
		HeatmapEditor,
		HillshadeEditor,
		LineEditor,
		ManualEditor,
		RasterEditor,
		SymbolEditor
	} from './editor-panels';
	import type SpriteLoader from './sprite';
	import Help from './util/Help.svelte';
	import { clean } from './util/clean';
	import { initTippy } from './util/initTippy';

	const mapStore = getMapContext();
	const layerId = getLayerIdContext();

	let layer: LayerSpecification = $mapStore
		.getStyle()
		.layers.find((l: LayerSpecification) => l.id === layerId);
	export let spriteLoader: SpriteLoader;
	export let relativeLayers: { [key: string]: string };
	let showManualEditor = false;
	export let selectedFormat: 'yaml' | 'json';
	$: layerTitle =
		relativeLayers && relativeLayers[layer.id] ? relativeLayers[layer.id] : clean(layer.id);

	const tippy = initTippy({
		placement: 'left',
		trigger: 'click',
		appendTo: document.body
	});
	let tooltipContent: HTMLElement;

	const handleEnterKey = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			e.target.click();
		}
	};
</script>

<div
	tabindex="0"
	role="button"
	class="palette-button has-tooltip-left has-tooltip-arrow"
	data-tooltip="Change layer style"
	use:tippy={{ content: tooltipContent }}
>
	<Fa icon={faPalette} size="lg" />
</div>

<div class="tooltip" bind:this={tooltipContent}>
	<div class="title">
		<div class="legend">
			<Legend {spriteLoader} />
		</div>
		<div class="layer-name">
			{layerTitle}
		</div>
	</div>

	<div class="header-buttons">
		<span
			role="button"
			tabindex="0"
			class="manual-edit-button has-tooltip-right has-tooltip-arrow"
			data-tooltip="Manual editor"
			on:click={() => (showManualEditor = !showManualEditor)}
			on:keydown={handleEnterKey}
		>
			<Fa icon={faPenToSquare} size="lg" />
		</span>

		<div class="help-button">
			<Help size="lg" bind:layerType={layer.type} />
		</div>

		<div
			role="button"
			class="close has-tooltip-bottom has-tooltip-arrow"
			data-tooltip="Close popup"
		>
			<Fa icon={faCircleXmark} size="lg" color="#1c1c1c" />
		</div>
	</div>

	<div class="editor-contents">
		{#if showManualEditor}
			<ManualEditor bind:selectedFormat />
		{:else if layer.type === 'background'}
			<BackgroundEditor />
		{:else if layer.type === 'fill'}
			<FillEditor />
		{:else if layer.type === 'line'}
			<LineEditor />
		{:else if layer.type === 'symbol'}
			<SymbolEditor bind:spriteLoader />
		{:else if layer.type === 'circle'}
			<CircleEditor />
		{:else if layer.type === 'fill-extrusion'}
			<FillExtrusionEditor />
		{:else if layer.type === 'hillshade'}
			<HillshadeEditor />
		{:else if layer.type === 'raster'}
			<RasterEditor />
		{:else if layer.type === 'heatmap'}
			<HeatmapEditor />
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
			display: flex;
			margin: 0;
			margin-left: 0.5rem;
			font-size: medium;
			font-weight: bold;
			text-transform: capitalize;
			border-bottom: 2px solid gray;

			.legend {
				padding-right: 0.2rem;
			}

			.layer-name {
				max-width: 190px;
				white-space: nowrap;
				overflow: hidden;
				text-transform: capitalize;
				text-overflow: ellipsis;
				-webkit-text-overflow: ellipsis;
				-o-text-overflow: ellipsis;
			}
		}

		.header-buttons {
			display: flex;
			position: absolute;
			top: 0.8rem;
			right: 0.5rem;

			.manual-edit-button,
			.help-button {
				padding-right: 0.5rem;
			}

			.close {
				cursor: pointer;
			}
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
