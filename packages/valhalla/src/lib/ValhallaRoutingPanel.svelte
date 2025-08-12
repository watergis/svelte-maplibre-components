<script lang="ts">
	import { costingOptions } from '$lib/constants';
	import { valhallaRoutingData } from '$lib/stores';
	import { faRoute, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
	import type { LngLat, Map } from 'maplibre-gl';
	import { onDestroy, untrack } from 'svelte';
	import Fa from 'svelte-fa';
	import {
		ValhallaRouting,
		type ValhallaRoutingOptions,
		type ValhallaTripSummary
	} from './ValhallaRouting';

	interface Props {
		map: Map;
		url: string;
		options: ValhallaRoutingOptions;
	}

	let { map = $bindable(), url, options }: Props = $props();

	let isRouting = $state(false);

	let meansOfTransport = $state(costingOptions[0].value);
	let tripSummary: ValhallaTripSummary | undefined = $state();
	let tripData: LngLat[] = $state([]);

	let errorMessage = $state('');

	onDestroy(() => {
		if (!$valhallaRoutingData) return;
		if (isRouting === true) {
			$valhallaRoutingData.addingPointOff();
		}
	});

	const handleAddPoint = () => {
		if (!$valhallaRoutingData) return;
		if (isRouting) {
			$valhallaRoutingData.addingPointOff();
		} else {
			$valhallaRoutingData.addingPointOn();
		}
	};

	const calcRoute = () => {
		if (!$valhallaRoutingData) return;
		$valhallaRoutingData.calcRoute(meansOfTransport);
	};

	const clearFeatures = () => {
		if (!$valhallaRoutingData) return;
		$valhallaRoutingData.clearFeatures();
	};
	$effect(() => {
		if (map) {
			untrack(() => {
				if (!$valhallaRoutingData) {
					valhallaRoutingData.update(() => undefined);
				}
				if (!$valhallaRoutingData) {
					$valhallaRoutingData = new ValhallaRouting(map, url, options);
				}

				map.on('routing.on', () => {
					isRouting = true;
				});
				map.on('routing.off', () => {
					isRouting = false;
					if (!$valhallaRoutingData) return;
					tripSummary = $valhallaRoutingData.getTripSummary();
					tripData = $valhallaRoutingData.getTripData();
				});
				map.on('routing.point.added', () => {
					if (!$valhallaRoutingData) return;
					tripData = $valhallaRoutingData.getTripData();
				});
				map.on('routing.calc.done', () => {
					if (!$valhallaRoutingData) return;
					tripSummary = $valhallaRoutingData.getTripSummary();
				});
				map.on('routing.clear', () => {
					if (!$valhallaRoutingData) return;
					tripSummary = $valhallaRoutingData.getTripSummary();
					tripData = $valhallaRoutingData.getTripData();
				});
				map.on('routing.error', (e) => {
					errorMessage = e.message;
				});
			});
		}
	});
	let hasData = $derived(tripData && tripData.length > 0);
	$effect(() => {
		if (tripData !== undefined) {
			untrack(() => {
				calcRoute();
			});
		}
	});
	$effect(() => {
		if (meansOfTransport !== undefined) {
			untrack(() => {
				calcRoute();
			});
		}
	});
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="control-label">Means of Transport</label>
<div class="transport-select-container">
	{#each costingOptions as item (item.value)}
		<label class="radio-transport" style="color:black">
			<input
				type="radio"
				name="transport-routing"
				onclick={() => {
					meansOfTransport = item.value;
				}}
				checked={meansOfTransport === item.value}
			/>
			<span class="icon">
				<Fa icon={item.icon} />
			</span>
			{item.label}
		</label>
	{/each}
</div>

<div class="valhalla-container">
	<button class="control-button" onclick={handleAddPoint}>
		<span class="control-icon">
			{#if isRouting}
				<Fa icon={faStop} />
			{:else}
				<Fa icon={faRoute} />
			{/if}
		</span>
		<span>
			{#if isRouting}
				Stop routing
			{:else}
				Start routing
			{/if}
		</span>
	</button>
	<button class="setting-button" disabled={!hasData} onclick={clearFeatures}>
		<span>
			<Fa icon={faTrash} />
		</span>
	</button>
</div>

{#if tripData && tripData.length > 0}
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="control-label">From</label>
	<div class="flex-container">
		<input
			class="input-text"
			type="text"
			placeholder="Name"
			value={`${tripData[0].lng.toFixed(6)}`}
			readonly
			style="width:50%;"
		/>
		<input
			class="input-text"
			type="text"
			placeholder="Name"
			value={`${tripData[0].lat.toFixed(6)}`}
			readonly
			style="width:50%;"
		/>
	</div>
	{#if tripData.length > 1}
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="control-label">To</label>
		<div class="flex-container">
			<input
				class="input-text"
				type="text"
				placeholder="Name"
				value={`${tripData[tripData.length - 1].lng.toFixed(6)}`}
				readonly
				style="width:50%;"
			/>
			<input
				class="input-text"
				type="text"
				placeholder="Name"
				value={`${tripData[tripData.length - 1].lat.toFixed(6)}`}
				readonly
				style="width:50%;"
			/>
		</div>
	{/if}

	{#if tripSummary}
		<div class="flex-container">
			<div class="flex-vertical-container" style="width:50%;">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="control-label">Length</label>
				<input class="input-text" type="text" value={`${tripSummary.length} km`} readonly />
			</div>
			<div class="flex-vertical-container" style="width:50%;">
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label class="control-label">Time</label>
				<input class="input-text" type="text" value={`${tripSummary.time} min`} readonly />
			</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="notification">
			{errorMessage}
		</div>
	{/if}
{/if}

<style lang="scss">
	.control-label {
		font-weight: bold;
		font-size: 14px;
	}

	.input-text {
		display: inline-flex;
		background-color: #fff;
		border-color: #dbdbdb;
		border-radius: 4px;
		color: #363636;
		font-size: 0.75rem;
		-webkit-appearance: none;
		align-items: center;
		border: 1px solid #363636;
		height: 1.5em;
		justify-content: flex-start;
		line-height: 1.5;
		padding-bottom: calc(0.5em - 1px);
		padding-left: calc(0.75em - 1px);
		padding-right: calc(0.75em - 1px);
		padding-top: calc(0.5em - 1px);
	}

	.transport-select-container {
		display: flex;
		margin-bottom: 0.5rem;

		.radio-transport {
			display: flex;

			.icon {
				padding-left: 0.5rem;
				padding-right: 0.5rem;
			}
		}
	}

	.notification {
		display: flex;
		height: auto;
		background-color: #ffe08a;
		color: rgba(0, 0, 0, 0.7);
		border-radius: 4px;
		margin-top: 0.5rem;
		padding-top: 1.25rem;
		padding-right: 2.5rem;
		padding-bottom: 1.25rem;
		padding-left: 1.5rem;
		overflow-wrap: break-word;
	}

	.valhalla-container {
		display: flex;
		margin-bottom: 0.5rem;

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

	.flex-container {
		display: flex;
	}

	.flex-vertical-container {
		display: flex;
		flex-direction: column;
	}
</style>
