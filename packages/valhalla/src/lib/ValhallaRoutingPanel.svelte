<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Map, LngLat } from 'maplibre-gl';
	import { valhallaRoutingData } from '$lib/stores';
	import {
		ValhallaRouting,
		type ValhallaRoutingOptions,
		type ValhallaTripSummary
	} from './ValhallaRouting';
	import { costingOptions } from '$lib/constants';

	export let map: Map;
	export let url: string;
	export let options: ValhallaRoutingOptions;

	let isRouting = false;

	let meansOfTransport = costingOptions[0].value;
	let tripSummary: ValhallaTripSummary | undefined;
	let tripData: LngLat[] = [];

	let errorMessage = '';

	$: {
		if (map) {
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
		}
	}

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

	$: tripData, calcRoute();
	$: meansOfTransport, calcRoute();

	const calcRoute = () => {
		if (!$valhallaRoutingData) return;
		$valhallaRoutingData.calcRoute(meansOfTransport);
	};

	const clearFeatures = () => {
		if (!$valhallaRoutingData) return;
		$valhallaRoutingData.clearFeatures();
	};
</script>

<div class="field">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label">Means of Transport</label>
	<div class="control">
		{#each costingOptions as item}
			<label class="radio" style="color:black">
				<input
					type="radio"
					name="transport-routing"
					on:click={() => {
						meansOfTransport = item.value;
					}}
					checked={meansOfTransport === item.value}
				/>
				<div class="icon is-small is-left pl-3 pr-3">
					<i class="fas {item.icon}" />
				</div>
				{item.label}
			</label>
		{/each}
	</div>
</div>

<div class="columns is-vcentered">
	<div class="column">
		<button class="button is-fullwidth is-link" on:click={handleAddPoint}>
			<span class="icon is-small">
				{#if isRouting}
					<i class="fas fa-stop" />
				{:else}
					<i class="fas fa-route" />
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
	</div>
</div>

{#if tripData && tripData.length > 0}
	<div class="columns is-vcentered">
		<div class="column py-0">
			<button class="button is-fullwidth is-link is-light" on:click={clearFeatures}>
				<span class="icon is-small">
					<i class="fas fa-trash" />
				</span>
				<span> Clear </span>
			</button>
		</div>
	</div>

	<div class="field is-horizontal px-3">
		<div class="field-label is-normal">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">From</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="columns pt-1">
					<div class="column is-half px-0">
						<input
							class="input is-small"
							type="text"
							placeholder="Name"
							value={`${tripData[0].lng.toFixed(6)}`}
							readonly
						/>
					</div>
					<div class="column is-half px-0">
						<input
							class="input is-small"
							type="text"
							placeholder="Name"
							value={`${tripData[0].lat.toFixed(6)}`}
							readonly
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
	{#if tripData.length > 1}
		<div class="field is-horizontal px-3">
			<div class="field-label is-normal">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">To</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="columns pt-1 is-mobile">
						<div class="column is-half px-0">
							<input
								class="input is-small"
								type="text"
								placeholder="Name"
								value={`${tripData[tripData.length - 1].lng.toFixed(6)}`}
								readonly
							/>
						</div>
						<div class="column is-half px-0">
							<input
								class="input is-small"
								type="text"
								placeholder="Name"
								value={`${tripData[tripData.length - 1].lat.toFixed(6)}`}
								readonly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if tripSummary}
		<div class="columns px-3 is-mobile">
			<div class="column is-half px-0">
				<div class="field">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">Length</label>
					<div class="control">
						<input class="input is-small" type="text" value={`${tripSummary.length} km`} readonly />
					</div>
				</div>
			</div>
			<div class="column is-half px-0 is-mobile">
				<div class="field">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label is-small">Time</label>
					<div class="control">
						<input class="input is-small" type="text" value={`${tripSummary.time} min`} readonly />
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if errorMessage}
		<div class="notification is-warning">
			<button class="delete" on:click={() => (errorMessage = '')} />
			{errorMessage}
		</div>
	{/if}
{/if}

<style lang="scss">
	@import './style/fa/css/all.css';
</style>
