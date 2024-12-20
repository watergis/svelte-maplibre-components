<script lang="ts">
	import CrosshairManager from '$lib/utils/crosshair-manager';
	import MapGenerator, { DPI, Format, PageOrientation, Size, Unit } from '$lib/utils/map-generator';
	import PrintableAreaManager from '$lib/utils/printable-area-manager';
	import {
		faBraille,
		faDownload,
		faFile,
		faFilePdf,
		faLeftRight,
		faUpDown,
		faXmark
	} from '@fortawesome/free-solid-svg-icons';
	import type { DragOptions } from '@neodrag/svelte';
	import { draggable } from '@neodrag/svelte';
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	let printableArea: PrintableAreaManager | undefined;
	let crosshairManager: CrosshairManager | undefined;

	let mapGenerator: MapGenerator;
	let printButton: HTMLButtonElement | undefined = $state();

	interface Props {
		map: Map | undefined;
		showPrintableArea?: boolean;
		showCrosshair?: boolean;
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
		paperSize?: any;
		dpi?: any;
		format?: any;
		orientation?: any;
	}

	let {
		map = $bindable(undefined),
		showPrintableArea = $bindable(true),
		showCrosshair = $bindable(true),
		position = $bindable('top-right'),
		paperSize = $bindable(Size.A4),
		dpi = $bindable(DPI[96]),
		format = $bindable(Format.PNG),
		orientation = $bindable(PageOrientation.Landscape)
	}: Props = $props();

	let isExportContainerShown = $state(false);
	let dragOptions: DragOptions = $state({});

	function MapExportControl() {}

	MapExportControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'maplibregl-ctrl maplibregl-ctrl-group';
		printButton.addEventListener('click', () => {
			isExportContainerShown = !isExportContainerShown;
			toggleButton();
		});
		this.controlContainer.appendChild(printButton);
		return this.controlContainer;
	};

	MapExportControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	/*global MapExportControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let mapExportControl: MapExportControl = $state(null);

	onMount(async () => {
		const { default: MapGenerator } = await import('./utils/map-generator');
		mapGenerator = new MapGenerator();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		mapExportControl = new MapExportControl();
	});

	const exportMap = () => {
		const actualPaperSize = getActualPaperSize();
		mapGenerator.generate(
			map,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			actualPaperSize,
			dpi,
			format,
			Unit.mm
		);
	};

	const getActualPaperSize = () => {
		let actualPaperSize = [paperSize[0], paperSize[1]];
		if (orientation !== PageOrientation.Landscape) {
			actualPaperSize = actualPaperSize.reverse();
		}
		return actualPaperSize;
	};

	const toggleButton = () => {
		if (!printButton) return;
		if (isExportContainerShown) {
			printButton.classList.add('maplibre-ctrl-icon-active');
		} else {
			printButton.classList.remove('maplibre-ctrl-icon-active');
		}

		if (!showPrintableArea) {
			togglePrintableArea(false);
		} else {
			togglePrintableArea(isExportContainerShown);
		}
		if (!showCrosshair) {
			toggleCrosshair(false);
		} else {
			toggleCrosshair(isExportContainerShown);
		}
	};

	const togglePrintableArea = (state: boolean) => {
		if (state === false) {
			if (printableArea !== undefined) {
				printableArea.destroy();
				printableArea = undefined;
			}
		} else {
			printableArea = new PrintableAreaManager(map);
			updatePrintableArea();
		}
	};

	const updatePrintableArea = () => {
		if (printableArea === undefined) {
			return;
		}
		const actualPaperSize = getActualPaperSize();
		printableArea.updateArea(actualPaperSize[0], actualPaperSize[1]);
	};

	const toggleCrosshair = (state: boolean) => {
		if (!map) return;
		if (state === false) {
			if (crosshairManager !== undefined) {
				crosshairManager.destroy();
				crosshairManager = undefined;
			}
		} else {
			crosshairManager = new CrosshairManager(map);
			crosshairManager.create();
		}
	};
	$effect(() => {
		if (map) {
			if (mapExportControl !== null && map.hasControl(mapExportControl) === false) {
				map.addControl(mapExportControl, position);
			}
			dragOptions.bounds = map.getContainer();
		}
	});
</script>

<button
	class="maplibregl-ctrl-export maplibre-ctrl-export-icon {isExportContainerShown ? 'active' : ''}"
	aria-label="export"
	bind:this={printButton}
></button>

{#if isExportContainerShown}
	<nav class="export-container" use:draggable={dragOptions}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<span
			class="icon close-icon"
			role="button"
			tabindex="0"
			onclick={() => {
				isExportContainerShown = !isExportContainerShown;
				toggleButton();
			}}
		>
			<Fa icon={faXmark} />
		</span>
		<div class="field">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="label is-small">Paper Size</label>
			<div class="control has-icons-left">
				<div class="select is-small is-fullwidth">
					<select bind:value={paperSize} onchange={updatePrintableArea}>
						{#each Object.keys(Size) as key}
							<option value={Size[key]}>{key}</option>
						{/each}
					</select>
				</div>
				<span class="icon is-small is-left">
					<Fa icon={faFile} />
				</span>
			</div>
		</div>
		<div class="field">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="label is-small">Page Orientation</label>
			<div class="control">
				{#each Object.keys(PageOrientation) as key}
					<label class="radio" style="color:black">
						<input
							type="radio"
							name="orientation"
							onclick={() => {
								orientation = PageOrientation[key];
								updatePrintableArea();
							}}
							checked={orientation === PageOrientation[key]}
						/>
						<span class="icon">
							<Fa
								icon={PageOrientation[key] === PageOrientation.Landscape ? faLeftRight : faUpDown}
								size="sm"
							/>
						</span>
						{key}
					</label>
				{/each}
			</div>
		</div>
		<div class="field">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="label is-small">Format</label>
			<div class="control has-icons-left">
				<div class="select is-small is-fullwidth">
					<select bind:value={format}>
						{#each Object.keys(Format) as key}
							<option value={Format[key]}>{key}</option>
						{/each}
					</select>
				</div>
				<span class="icon is-small is-left">
					<Fa icon={faFilePdf} />
				</span>
			</div>
		</div>
		<div class="field">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="label is-small">DPI</label>
			<div class="control has-icons-left">
				<div class="select is-small is-fullwidth">
					<select bind:value={dpi}>
						{#each Object.keys(DPI) as key}
							<option value={DPI[key]}>{key}</option>
						{/each}
					</select>
				</div>
				<span class="icon is-small is-left">
					<Fa icon={faBraille} />
				</span>
			</div>
		</div>

		<button class="button is-success is-fullwidth" onclick={exportMap}>
			<span class="icon">
				<Fa icon={faDownload} />
			</span>
			<span>Export</span>
		</button>
	</nav>
{/if}

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.maplibre-ctrl-export-icon {
		background: url('data:image/svg+xml;charset=UTF-8,<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m422.5 99v-24c0-41.355-33.645-75-75-75h-184c-41.355 0-75 33.645-75 75v24z"/><path d="m118.5 319v122 26 15c0 16.568 13.431 30 30 30h214c16.569 0 30-13.432 30-30v-15-26-122zm177 128h-80c-8.284 0-15-6.716-15-15s6.716-15 15-15h80c8.284 0 15 6.716 15 15s-6.716 15-15 15zm0-64h-80c-8.284 0-15-6.716-15-15s6.716-15 15-15h80c8.284 0 15 6.716 15 15s-6.716 15-15 15z"/><path d="m436.5 129h-361c-41.355 0-75 33.645-75 75v120c0 41.355 33.645 75 75 75h13v-80h-9c-8.284 0-15-6.716-15-15s6.716-15 15-15h24 304 24c8.284 0 15 6.716 15 15s-6.716 15-15 15h-9v80h14c41.355 0 75-33.645 75-75v-120c0-41.355-33.645-75-75-75zm-309 94h-48c-8.284 0-15-6.716-15-15s6.716-15 15-15h48c8.284 0 15 6.716 15 15s-6.716 15-15 15z"/></g></svg>');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 70%;

		&.active {
			background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>');
			background-position: center;
			background-repeat: no-repeat;
			background-size: 40%;
		}
	}

	.export-container {
		position: absolute;
		background-color: white;
		padding: 10px;
		bottom: 10px;
		right: 10px;
		z-index: 10;
		cursor: grab;
		width: 260px;

		.close-icon {
			position: absolute;
			top: 5px;
			right: 5px;
			cursor: pointer;
		}
	}
</style>
