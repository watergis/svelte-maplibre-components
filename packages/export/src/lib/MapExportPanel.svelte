<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Map } from 'maplibre-gl';
	import MapGenerator, { PageOrientation, Size, DPI, Format, Unit } from '$lib/utils/map-generator';
	import PrintableAreaManager from '$lib/utils/printable-area-manager';
	import CrosshairManager from '$lib/utils/crosshair-manager';
	import './style/fa/css/all.css';

	export let map: Map;
	export let showPrintableArea = true;
	export let showCrosshair = true;

	let isShownPanel = false;

	let mapGenerator: MapGenerator;
	let printableArea: PrintableAreaManager | undefined;
	let crosshairManager: CrosshairManager | undefined;

	export let paperSize = Size.A4;
	export let dpi = DPI[96];
	export let format = Format.PNG;
	export let orientation = PageOrientation.Landscape;

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
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">Paper Size</label>
		<div class="control has-icons-left">
			<div class="select is-small is-fullwidth">
				<select bind:value={paperSize}>
					{#each Object.keys(Size) as key}
						<option value={Size[key]}>{key}</option>
					{/each}
				</select>
			</div>
			<div class="icon is-small is-left">
				<i class="fas fa-file" />
			</div>
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">Page Orientation</label>
		<div class="control">
			{#each Object.keys(PageOrientation) as key}
				<label class="radio" style="color:black">
					<input
						type="radio"
						name="orientation"
						on:click={() => {
							orientation = PageOrientation[key];
						}}
						checked={orientation === PageOrientation[key]}
					/>
					<div class="icon is-small is-left">
						<i
							class="fas {`${
								PageOrientation[key] === PageOrientation.Landscape ? 'fa-left-right' : 'fa-up-down'
							}`}"
						/>
					</div>
					{key}
				</label>
			{/each}
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y-label-has-associated-control -->
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
				<i class="fas fa-file-pdf" />
			</div>
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y-label-has-associated-control -->
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
				<i class="fas fa-braille" />
			</div>
		</div>
	</div>

	<div class="field">
		<button
			class="button is-small is-success"
			style="width: 90%; text-align:center;"
			on:click={exportMap}
		>
			<span class="icon">
				<i class="fas fa-download" />
			</span>
			<span>Export</span>
		</button>
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';

	.export-container {
		background-color: white;
		padding: 10px;
	}
</style>
