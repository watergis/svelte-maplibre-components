<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { valhallaControlData } from './stores';
	import {
		ContourType,
		ValhallaIsochrone,
		type ValhallaIsochroneOptions
	} from '$lib/ValhallaIsochrone';
	import { costingOptions } from './constants';

	export let map: Map;
	export let url: string;
	export let options: ValhallaIsochroneOptions;

	let contourType: ContourType = ContourType.Time;
	let longitude: number;
	let latitude: number;
	let contours = options.Contours;
	if (!contours) {
		contours = [
			{
				time: 3,
				distance: 1,
				color: 'ff0000'
			},
			{
				time: 5,
				distance: 2,
				color: 'ffff00'
			},
			{
				time: 10,
				distance: 3,
				color: '0000ff'
			},
			{
				time: 15,
				distance: 4,
				color: 'ff00ff'
			}
		];
	}

	let meansOfTransport = costingOptions[0].value;

	$: {
		if (map) {
			if (!$valhallaControlData) {
				valhallaControlData.update(() => undefined);
			}
			if (!$valhallaControlData) {
				$valhallaControlData = new ValhallaIsochrone(map, url);
			}
			longitude = map.getCenter().lng;
			latitude = map.getCenter().lat;
			map.on('moveend', () => {
				longitude = map.getCenter().lng;
				latitude = map.getCenter().lat;
			});
		}
	}
	const calc = (contourType: ContourType) => {
		$valhallaControlData?.getIsochrone(
			Number(longitude),
			Number(latitude),
			contourType,
			meansOfTransport,
			JSON.parse(JSON.stringify(contours))
		);
	};
	const clear = () => {
		$valhallaControlData?.clearFeatures();
	};
</script>

<div class="transport-select">
	<div class="field">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">Type of Isochrone</label>
		<div class="control">
			<label class="radio" style="color:black">
				<input
					type="radio"
					name="isochrone-{ContourType.Time}"
					on:click={() => {
						contourType = ContourType.Time;
					}}
					checked={contourType === ContourType.Time}
				/>
				<div class="icon is-small is-left pl-3 pr-3">
					<i class="fas fa-clock" />
				</div>
				{'Time'}
			</label>
			<label class="radio" style="color:black">
				<input
					type="radio"
					name="isochrone-{ContourType.Distance}"
					on:click={() => {
						contourType = ContourType.Distance;
					}}
					checked={contourType === ContourType.Distance}
				/>
				<div class="icon is-small is-left pl-3 pr-3">
					<i class="fas fa-ruler" />
				</div>
				{'Distance'}
			</label>
		</div>
	</div>
	<div class="field">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">Means of Transport</label>
		<div class="control">
			{#each costingOptions as item}
				<label class="radio" style="color:black">
					<input
						type="radio"
						name="transport-{contourType}"
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
	{#if longitude && latitude}
		<div class="field is-horizontal">
			<div class="field-label is-normal">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">From</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="columns pt-1 px-3 is-mobile">
						<div class="column is-half px-0">
							<input
								class="input is-small"
								type="text"
								placeholder="Name"
								value={`${longitude.toFixed(6)}`}
								readonly
							/>
						</div>
						<div class="column is-half px-0">
							<input
								class="input is-small"
								type="text"
								placeholder="Name"
								value={`${latitude.toFixed(6)}`}
								readonly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
<div style="display:inline-flex">
	<div class="columns px-3 is-mobile">
		{#if contours}
			{#each contours as contour}
				<div class="column is-one-quarter px-0">
					<div class="field">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="label is-small">
							{#if contourType === ContourType.Time}
								{contour.time} min
							{:else}
								{contour.distance} km
							{/if}
						</label>
						<div class="control">
							{#if contourType === ContourType.Time}
								<input class="input is-small" type="number" bind:value={contour.time} />
							{:else}
								<input class="input is-small" type="number" bind:value={contour.distance} />
							{/if}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
<div class="columns is-vcentered pt-2">
	<div class="column is-half px-1 py-4">
		<button class="button is-fullwidth is-link" on:click={() => calc(contourType)}>
			<span class="icon is-small">
				{#if contourType === ContourType.Time}
					<i class="fas fa-clock" />
				{:else}
					<i class="fas fa-ruler" />
				{/if}
			</span>
			<span> Calculate </span>
		</button>
	</div>
	<div class="column is-half px-1 py-4">
		<button class="button is-fullwidth is-link is-light" on:click={clear}>
			<span class="icon is-small">
				<i class="fas fa-trash" />
			</span>
			<span> Clear </span>
		</button>
	</div>
</div>

<style lang="scss">
	@import './style/fa/css/all.css';

	.transport-select {
		padding-top: 0.5em;
		padding-bottom: 0.5em;
	}
	.tool-button {
		padding-top: 0.5em;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>
