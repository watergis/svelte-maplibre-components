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
		faUpDown
	} from '@fortawesome/free-solid-svg-icons';
	import type { Map } from 'maplibre-gl';
	import { onDestroy, onMount } from 'svelte';
	import Fa from 'svelte-fa';

	let isShownPanel = false;

	let mapGenerator: MapGenerator;
	let printableArea: PrintableAreaManager | undefined;
	let crosshairManager: CrosshairManager | undefined;

	interface Props {
		map: Map | undefined;
		showPrintableArea?: boolean;
		showCrosshair?: boolean;
		paperSize?: any;
		dpi?: any;
		format?: any;
		orientation?: any;
	}

	let {
		map = $bindable(undefined),
		showPrintableArea = $bindable(true),
		showCrosshair = $bindable(true),
		paperSize = $bindable(Size.A4),
		dpi = $bindable(DPI[96]),
		format = $bindable(Format.PNG),
		orientation = $bindable(PageOrientation.Landscape)
	}: Props = $props();

	onMount(() => {
		async () => {
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
		};
	});

	onDestroy(() => {
		isShownPanel = false;
		togglePrintableArea(false);
		toggleCrosshair(false);
	});

	const exportMap = () => {
		if (!map) return;
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
	<div class="field">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">Paper Size</label>
		<div class="control has-icons-left">
			<div class="select is-small is-fullwidth">
				<select bind:value={paperSize} onchange={updatePrintableArea}>
					{#each Object.keys(Size) as key}
						<option value={Size[key]}>{key}</option>
					{/each}
				</select>
			</div>
			<div class="icon is-small is-left">
				<Fa icon={faFile} />
			</div>
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">Page Orientation</label>
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
					<div class="icon is-small is-left">
						<Fa
							icon={PageOrientation[key] === PageOrientation.Landscape ? faLeftRight : faUpDown}
							size="sm"
						/>
					</div>
					{key}
				</label>
			{/each}
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">Format</label>
		<div class="control has-icons-left">
			<div class="select is-small is-fullwidth">
				<select bind:value={format}>
					{#each Object.keys(Format) as key}
						<option value={Format[key]}>{key}</option>
					{/each}
				</select>
			</div>
			<div class="icon is-small is-left">
				<Fa icon={faFilePdf} />
			</div>
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">DPI</label>
		<div class="control has-icons-left">
			<div class="select is-small is-fullwidth">
				<select bind:value={dpi}>
					{#each Object.keys(DPI) as key}
						<option value={DPI[key]}>{key}</option>
					{/each}
				</select>
			</div>
			<div class="icon is-small is-left">
				<Fa icon={faBraille} />
			</div>
		</div>
	</div>

	<button class="button is-fullwidth is-success" onclick={exportMap}>
		<span class="icon is-small">
			<Fa icon={faDownload} size="sm" />
		</span>
		<span>Export</span>
	</button>
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.export-container {
		background-color: white;
		padding: 10px;
	}
</style>
