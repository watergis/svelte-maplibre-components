<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Map } from 'maplibre-gl';
	import { measureManager } from './stores';
	import type { MeasureOption } from './types';
	import MeasureManager from './MeasureManager';
	import './style/fa/css/all.css';

	export let map: Map;
	export let terrainRgbUrl: string | undefined = undefined;
	export let measureOption: MeasureOption;

	let isQuery: boolean;
	let hasData = false;

	$: if (map) {
		if (!$measureManager) {
			$measureManager = new MeasureManager(map, terrainRgbUrl, measureOption);
		}

		map.on('measure.on', () => {
			isQuery = true;
		});

		map.on('measure.off', () => {
			isQuery = false;
		});

		map.on('measure.add', () => {
			hasData = $measureManager.hasData();
		});

		map.on('measure.clear', () => {
			hasData = false;
		});
	}

	onDestroy(() => {
		if (isQuery === true) {
			$measureManager.measuringOff();
		}
	});

	const measureStart = () => {
		if (isQuery) {
			$measureManager.measuringOff();
		} else {
			$measureManager.measuringOn();
		}
	};
</script>

{#if map}
	<div class="columns is-vcentered">
		<div class="column">
			<button class="button is-fullwidth is-link" on:click={() => measureStart()}>
				<span class="icon is-small">
					{#if isQuery}
						<i class="fas fa-stop" />
					{:else}
						<i class="fas fa-ruler" />
					{/if}
				</span>
				<span>
					{#if isQuery}
						Stop measure
					{:else}
						Start measure
					{/if}
				</span>
			</button>
		</div>
	</div>
	{#if hasData}
		<div class="columns is-vcentered pb-3">
			<div class="column is-half py-0">
				<button
					class="button is-fullwidth is-link is-light"
					on:click={() => $measureManager.clearFeatures()}
				>
					<span class="icon is-small">
						<i class="fas fa-trash" />
					</span>
					<span> Clear </span>
				</button>
			</div>
			<div class="column is-half py-0">
				<button
					class="button is-fullwidth is-link is-light"
					on:click={() => $measureManager.downloadGeoJSON()}
				>
					<span class="icon is-small">
						<i class="fas fa-download" />
					</span>
					<span> GeoJSON </span>
				</button>
			</div>
		</div>
	{/if}
{/if}
