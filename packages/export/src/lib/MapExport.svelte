<script lang="ts">
	import { onMount } from 'svelte';
	import type { Map } from 'maplibre-gl';
	import { PageOrientation, Size, DPI, Format, Unit } from '$lib/utils/map-generator';
	import type MapGenerator from '$lib/utils/map-generator';

	export let map: Map;
	let mapGenerator: MapGenerator;
	export let paperSize = Size.A4;
	export let dpi = DPI[96];
	export let format = Format.PNG;
	export let orientation = PageOrientation.Landscape;

	onMount(async () => {
		const { default: MapGenerator } = await import('./utils/map-generator');
		mapGenerator = new MapGenerator();
	});

	const getActualPaperSize = () => {
		let actualPaperSize = [paperSize[0], paperSize[1]];
		if (orientation !== PageOrientation.Landscape) {
			actualPaperSize = actualPaperSize.reverse();
		}
		return actualPaperSize;
	};

	export const exportMap = () => {
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
</script>

<div class="field">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">Paper Size</label>
	<div class="control has-icons-left">
		<div class="select is-fullwidth">
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
		<div class="select is-fullwidth">
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
		<div class="select is-fullwidth">
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

<style>
	@import 'style/fa/css/all.css';
</style>
