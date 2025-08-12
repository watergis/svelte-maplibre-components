<script lang="ts">
	import { faDownload, faRuler, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
	import type { Map } from 'maplibre-gl';
	import { onDestroy } from 'svelte';
	import Fa from 'svelte-fa';
	import MeasureManager from './MeasureManager';
	import { measureManager } from './stores';
	import type { MeasureOption } from './types';

	interface Props {
		map: Map;
		terrainRgbUrl?: string | undefined;
		measureOption: MeasureOption | undefined;
	}

	let { map = $bindable(), terrainRgbUrl = undefined, measureOption = undefined }: Props = $props();

	let isQuery: boolean = $state(false);
	let hasData = $state(false);

	$effect(() => {
		if (map) {
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
	});

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
	<div class="measure-container">
		<button class="control-button" onclick={() => measureStart()}>
			<span class="control-icon">
				{#if isQuery}
					<Fa icon={faStop} />
				{:else}
					<Fa icon={faRuler} />
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
		<button
			class="setting-button"
			disabled={!hasData}
			onclick={() => $measureManager.clearFeatures()}
		>
			<span>
				<Fa icon={faTrash} />
			</span>
		</button>
		<button
			class="setting-button"
			disabled={!hasData}
			onclick={() => $measureManager.downloadGeoJSON()}
		>
			<span>
				<Fa icon={faDownload} />
			</span>
		</button>
	</div>
{/if}

<style lang="scss">
	.measure-container {
		display: flex;

		.control-button {
			align-items: center;
			background-clip: padding-box;
			background-color: #485fc7;
			border: 1px solid transparent;
			border-radius: 0.25rem;
			box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
			box-sizing: border-box;
			color: #fff;
			cursor: pointer;
			display: inline-flex;
			font-family:
				system-ui,
				-apple-system,
				system-ui,
				'Helvetica Neue',
				Helvetica,
				Arial,
				sans-serif;
			font-size: 16px;
			font-weight: 600;
			justify-content: center;
			line-height: 1.25;
			margin: 0;
			min-height: 3rem;
			padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
			position: relative;
			text-decoration: none;
			transition: all 250ms;
			user-select: none;
			-webkit-user-select: none;
			touch-action: manipulation;
			vertical-align: baseline;
			width: 100%;

			.control-icon {
				padding-right: 0.5rem;
			}
		}

		.control-button:hover,
		.control-button:focus:enabled {
			background-color: #596dc5;
			box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
		}

		.control-button:hover:enabled {
			transform: translateY(-1px);
		}

		.control-button:active:enabled {
			background-color: #596dc5;
			box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
			transform: translateY(0);
		}

		.setting-button {
			align-items: center;
			background-color: #ffffff;
			border: 1px solid rgba(0, 0, 0, 0.1);
			border-radius: 0.25rem;
			box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
			box-sizing: border-box;
			color: rgba(0, 0, 0, 0.85);
			cursor: pointer;
			display: inline-flex;
			font-family:
				system-ui,
				-apple-system,
				system-ui,
				'Helvetica Neue',
				Helvetica,
				Arial,
				sans-serif;
			font-size: 16px;
			font-weight: 600;
			justify-content: center;
			line-height: 1.25;
			margin: 0;
			min-height: 3rem;
			padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
			position: relative;
			text-decoration: none;
			transition: all 250ms;
			user-select: none;
			-webkit-user-select: none;
			touch-action: manipulation;
			vertical-align: baseline;
			width: auto;
		}

		.setting-button:hover:enabled,
		.setting-button:focus:enabled {
			border-color: rgba(0, 0, 0, 0.15);
			box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
			color: rgba(0, 0, 0, 0.65);
		}

		.setting-button:hover:enabled {
			transform: translateY(-1px);
		}

		.setting-button:active:enabled {
			background-color: #f0f0f1;
			border-color: rgba(0, 0, 0, 0.15);
			box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
			color: rgba(0, 0, 0, 0.65);
			transform: translateY(0);
		}
	}
</style>
