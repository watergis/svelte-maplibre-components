<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map } from 'maplibre-gl';
	import { PageOrientation, Size, DPI, Format, Unit } from '$lib/utils/map-generator';
	import type MapGenerator from '$lib/utils/map-generator';
	import PrintableAreaManager from '$lib/utils/printable-area-manager';
	import CrosshairManager from '$lib/utils/crosshair-manager';
	import MapExport from './MapExport.svelte';

	export let map: Map;
	export let showPrintableArea = true;
	export let showCrosshair = true;

	let isShownPanel = false;

	let mapExportComponent: MapExport;

	let mapGenerator: MapGenerator;
	let printableArea: PrintableAreaManager | undefined;
	let crosshairManager: CrosshairManager | undefined;
	let paperSize = Size.A4;
	let dpi = DPI[96];
	let format = Format.PNG;
	let orientation = PageOrientation.Landscape;

	$: paperSize, updatePrintableArea();
	$: orientation, updatePrintableArea();

	onMount(async () => {
		const { default: MapGenerator } = await import('./utils/map-generator');
		mapGenerator = new MapGenerator();
		isShownPanel = true;
		if (!showPrintableArea) {
			togglePrintableArea(false);
		} else {
			togglePrintableArea(isShownPanel);
		}
		if (!showCrosshair) {
			toggleCrosshair(false);
		} else {
			toggleCrosshair(isShownPanel);
		}
	});

	onDestroy(() => {
		isShownPanel = false;
		togglePrintableArea(false);
		toggleCrosshair(false);
	});

	const getActualPaperSize = () => {
		let actualPaperSize = [paperSize[0], paperSize[1]];
		if (orientation !== PageOrientation.Landscape) {
			actualPaperSize = actualPaperSize.reverse();
		}
		return actualPaperSize;
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
</script>

<div class="export-container">
	<MapExport
		bind:this={mapExportComponent}
		bind:map
		bind:format
		bind:paperSize
		bind:dpi
		bind:orientation
	/>

	<div class="field ">
		<button class="button is-fullwidth is-success" on:click={mapExportComponent.exportMap}>
			<span class="icon">
				<i class="fas fa-download" />
			</span>
			<span>Export</span>
		</button>
	</div>
</div>

<style>
	@import 'style/fa/css/all.css';

	.export-container {
		background-color: white;
		padding: 10px;
	}
</style>
