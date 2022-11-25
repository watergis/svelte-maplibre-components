<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { valhallaControlData } from './stores';
	import {
		ContourType,
		ValhallaIsochrone,
		type ValhallaIsochroneOptions
	} from '$lib/ValhallaIsochrone';
	import { costingOptions } from './constants';
	import Fa from 'svelte-fa';
	import { faClock, faRuler, faTrash } from '@fortawesome/free-solid-svg-icons';

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

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="control-label">Type of Isochrone</label>
<div class="transport-select-container">
	<label class="radio-transport" style="color:black">
		<input
			type="radio"
			name="isochrone-{ContourType.Time}"
			on:click={() => {
				contourType = ContourType.Time;
			}}
			checked={contourType === ContourType.Time}
		/>
		<div class="icon is-small is-left pl-3 pr-3">
			<Fa icon={faClock} />
		</div>
		{'Time'}
	</label>
	<label class="radio-transport" style="color:black">
		<input
			type="radio"
			name="isochrone-{ContourType.Distance}"
			on:click={() => {
				contourType = ContourType.Distance;
			}}
			checked={contourType === ContourType.Distance}
		/>
		<div class="icon is-small is-left pl-3 pr-3">
			<Fa icon={faRuler} />
		</div>
		{'Distance'}
	</label>
</div>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="control-label">Means of Transport</label>
<div class="transport-select-container">
	{#each costingOptions as item}
		<label class="radio-transport" style="color:black">
			<input
				type="radio"
				name="transport-isocrhone"
				on:click={() => {
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

{#if longitude && latitude}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="control-label">From</label>
	<div class="flex-container">
		<input
			class="input-text"
			type="text"
			placeholder="Name"
			value={`${longitude.toFixed(6)}`}
			readonly
			style="width:50%;"
		/>
		<input
			class="input-text"
			type="text"
			placeholder="Name"
			value={`${latitude.toFixed(6)}`}
			readonly
			style="width:50%;"
		/>
	</div>
{/if}

{#if contours}
	<div class="flex-container">
		{#each contours as contour}
			<div class="flex-vertical-container" style="width:25%;">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="control-label">
					{#if contourType === ContourType.Time}
						{contour.time} min
					{:else}
						{contour.distance} km
					{/if}
				</label>
				{#if contourType === ContourType.Time}
					<input class="input-text" type="number" bind:value={contour.time} />
				{:else}
					<input class="input-text" type="number" bind:value={contour.distance} />
				{/if}
			</div>
		{/each}
	</div>
{/if}

<div class="valhalla-container">
	<button class="control-button" on:click={() => calc(contourType)}>
		<span class="control-icon">
			{#if contourType === ContourType.Time}
				<Fa icon={faClock} />
			{:else}
				<Fa icon={faRuler} />
			{/if}
		</span>
		<span> Calculate </span>
	</button>
	<button class="setting-button" on:click={clear}>
		<span>
			<Fa icon={faTrash} />
		</span>
	</button>
</div>

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

	.flex-container {
		display: flex;
	}

	.flex-vertical-container {
		display: flex;
		flex-direction: column;
		margin-top: 0.5rem;
	}

	.valhalla-container {
		display: flex;
		margin-top: 0.5rem;

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
			font-family: system-ui, -apple-system, system-ui, 'Helvetica Neue', Helvetica, Arial,
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
			font-family: system-ui, -apple-system, system-ui, 'Helvetica Neue', Helvetica, Arial,
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
