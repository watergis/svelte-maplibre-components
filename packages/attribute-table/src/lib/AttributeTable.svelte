<script lang="ts">
	import { Datatable, TableHandler, ThFilter, ThSort } from '@vincjo/datatables';
	import {
		LngLatBounds,
		Marker,
		type FillLayerSpecification,
		type HeatmapLayerSpecification,
		type LineLayerSpecification,
		type LngLatLike,
		type Map,
		type MapGeoJSONFeature,
		type SymbolLayerSpecification,
		type VectorSourceSpecification
	} from 'maplibre-gl';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { distinct } from './util/index.js';

	interface Props {
		map: Map;
		rowsPerPage?: number;
		minZoom?: number;
	}

	let {
		map = $bindable(undefined),
		rowsPerPage = $bindable(50),
		minZoom = $bindable(14)
	}: Props = $props();
	let layers: string[] = $state();
	let selectedSourceLayerId = writable('');

	let containerHeight = $state(0);
	let headerHeight = $state(0);

	let features: MapGeoJSONFeature[] = $state([]);
	let data: { [key: string]: string }[] = $state([]);

	// svelte-ignore state_referenced_locally
	const table = new TableHandler(data, { rowsPerPage });
	let columns: { id: string; label: string }[] = $state([]);

	let zoomedMarker: Marker;
	let mapChanged = $state(false);

	export const getLayerList = () => {
		const ids: string[] = [];
		const style = map.getStyle();
		const zoom = map.getZoom();
		style.layers.forEach((layer) => {
			if (!['symbol', 'line', 'fill', 'heatmap'].includes(layer.type)) return;
			const vectorLayer:
				| SymbolLayerSpecification
				| LineLayerSpecification
				| FillLayerSpecification
				| HeatmapLayerSpecification = layer as
				| SymbolLayerSpecification
				| LineLayerSpecification
				| FillLayerSpecification
				| HeatmapLayerSpecification;

			const id = vectorLayer['source-layer'];
			if (!id) return;

			const source = style.sources[vectorLayer.source] as VectorSourceSpecification;
			let minzoom = vectorLayer.minzoom;
			if (!minzoom) {
				minzoom = source.minzoom ?? 0;
			}
			if (!(minzoom <= zoom)) return;

			const features = map.queryRenderedFeatures(undefined, { layers: [layer.id] });
			if (features.length === 0) return;
			ids.push(id);
		});
		layers = ids.map((id) => id).filter(distinct);
	};

	const getLayerIdsBySourceLayer = (sourceLayerId: string) => {
		const style = map.getStyle();
		const layers = style.layers.filter((l) => l['source-layer'] === sourceLayerId);
		const ids = layers.map((l) => l.id);
		return ids;
	};

	const updateTable = () => {
		if (!$selectedSourceLayerId) return;
		if (!map) return;

		mapChanged = false;

		const ids = getLayerIdsBySourceLayer($selectedSourceLayerId);
		if (ids.length > 0) {
			features = map.queryRenderedFeatures(undefined, { layers: ids });
			data = [];
			features.forEach((f) => {
				const prop = f.properties;

				const exists = data.find((d) => {
					let allmatched = true;
					Object.keys(d).forEach((key) => {
						if (!(prop[key] && d[key] === prop[key])) {
							allmatched = false;
						}
					});
					if (allmatched) {
						return d;
					}
				});
				if (!exists) {
					data.push(prop);
				}
			});

			if (data.length > 0) {
				let keys = data.flatMap((obj) => Object.keys(obj));
				keys = keys.map((key) => key).filter(distinct);
				columns = keys.map((key) => {
					const text = key
						.toLowerCase()
						.replace(/_/g, ' ')
						.replace(/(?: |\b)(\w)/g, function (key) {
							return key.toUpperCase();
						});
					return {
						id: key,
						label: text
					};
				});
				table.setRows(data);
				return;
			}
		}
	};

	const handleReload = () => {
		getLayerList();
		updateTable();
		mapChanged = false;
	};

	const zoomToFeature = (props?: { [key: string]: string }, isPan = false) => {
		const feature = features.find((f) => JSON.stringify(f.properties) === JSON.stringify(props));
		if (!feature) return;
		const geometry = feature.geometry;

		const type = geometry.type.toLowerCase();
		let center: LngLatLike;
		if (type === 'point') {
			const point: number[] = geometry.coordinates as number[];
			center = [point[0], point[1]];
			let currentZoom = map.getZoom();

			if (!isPan) {
				if (currentZoom < minZoom) {
					currentZoom = minZoom;
				}
			}
			map.flyTo({
				center: center,
				zoom: currentZoom
			});
		} else if (type === 'linestring') {
			const coordinates = geometry.coordinates;
			const bounds = coordinates.reduce(
				function (bounds, coord) {
					return bounds.extend(coord);
				},
				new LngLatBounds(coordinates[0], coordinates[0])
			);

			if (!isPan) {
				map.fitBounds(bounds, {
					padding: 20
				});
			}

			center = coordinates[parseInt(`${coordinates.length / 2}`)];

			if (isPan) {
				map.flyTo({
					center: center,
					zoom: map.getZoom()
				});
			}
		} else if (type === 'polygon') {
			const coordinates = geometry.coordinates[0];
			const bounds = coordinates.reduce(
				function (bounds, coord) {
					return bounds.extend(coord);
				},
				new LngLatBounds(coordinates[0], coordinates[0])
			);

			if (!isPan) {
				map.fitBounds(bounds, {
					padding: 20
				});
			}

			center = [(bounds._ne.lng + bounds._sw.lng) / 2, (bounds._ne.lat + bounds._sw.lat) / 2];

			if (isPan) {
				map.flyTo({
					center: center,
					zoom: map.getZoom()
				});
			}
		}

		if (zoomedMarker) {
			zoomedMarker.remove();
		}
		zoomedMarker = new Marker().setLngLat(center).addTo(map);
	};

	onMount(() => {
		selectedSourceLayerId.subscribe(updateTable);
	});
	$effect(() => {
		if (map) {
			map.on('sourcedata', (e) => {
				if (e.isSourceLoaded) {
					getLayerList();
				}
			});
			map.on('zoomend', () => {
				mapChanged = true;
			});
			map.on('moveend', () => {
				mapChanged = true;
			});
		}
	});
</script>

<div class="attribute-table-container" bind:clientHeight={containerHeight}>
	<header class="header" bind:clientHeight={headerHeight}>
		<select class="layer-select" bind:value={$selectedSourceLayerId}>
			<option>Select a layer</option>
			{#if layers && layers.length > 0}
				{#each layers as id}
					<option value={id}>{id}</option>
				{/each}
			{/if}
		</select>

		<button
			class="reload-button"
			onclick={handleReload}
			disabled={$selectedSourceLayerId && !mapChanged}
			aria-label="reload"
		>
			<i class="fa-solid fa-rotate"></i>
		</button>
	</header>

	<div class="attribute-table" style="height: {containerHeight - headerHeight - 20}px">
		{#if data.length === 0}
			<p class="no-data">
				No data to be shown in the selected layer and rendered area. Please select another layer or
				move the map.
			</p>
		{:else}
			{#key data}
				<Datatable basic {table}>
					<table>
						<thead>
							<tr>
								<th>Operation</th>
								{#each columns as col}
									<ThSort {table} field={col.id}>{col.label}</ThSort>
								{/each}
							</tr>
							<tr>
								<th></th>
								{#each columns as col}
									<ThFilter {table} field={col.id}></ThFilter>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each table.rows as row}
								<tr>
									<td>
										<div class="ope-col">
											<button
												class="operation-button"
												onclick={() => {
													zoomToFeature(row);
												}}
												aria-label="zoom"
											>
												<i class="fa-solid fa-magnifying-glass fa-lg"></i>
											</button>
											<button
												class="operation-button"
												onclick={() => {
													zoomToFeature(row, true);
												}}
												aria-label="pan"
											>
												<i class="fa-solid fa-up-down-left-right fa-lg"></i>
											</button>
										</div>
									</td>
									{#each columns as col}
										<td>
											{#if row[col.id]}
												{row[col.id]}
											{/if}
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</Datatable>
			{/key}
		{/if}
	</div>
</div>

<style lang="scss">
	.attribute-table-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;

		.header {
			display: flex;
			flex-direction: row;
			gap: 5px;
			margin-left: 16px;

			.layer-select {
				width: 196px;
				height: 26px;
				border-radius: 4px;
				border-color: #cccccc;
				box-sizing: border-box;
				font-size: 1em;
			}

			select {
				width: 100%;
				border-radius: 4px;
				border-color: #cccccc;
				box-sizing: border-box;
				background: transparent;
				-webkit-appearance: none;
				cursor: pointer;
				background: #fff
					url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2011%2011%22%3E%3Cpath%20d%3D%22M4.33%208.5L0%201L8.66%201z%22%20fill%3D%22%23666%22%2F%3E%3C%2Fsvg%3E')
					right 0.3em center no-repeat;
				padding-left: 0.5em;
				color: #000;

				/* Firefox hide arrow */
				-moz-appearance: none;
				text-indent: 0.01px;
				text-overflow: '';
			}

			.reload-button {
				cursor: pointer;
				border: none;
				width: 25px;
				height: 25px;
				border-radius: 5px;
				background: #1c1c1c;
				color: #ffffff;
				align-items: center;
				display: inline-flex;
				justify-content: center;
			}

			.reload-button:disabled {
				background: #a5a5a5;
				cursor: default;
			}

			.reload-button:before {
				line-height: 25px;
				width: 25px;
				text-align: center;
				font-style: normal;
				font-variant: normal;
				text-rendering: auto;
				-webkit-font-smoothing: antialiased;
			}
		}

		.no-data {
			margin: 1rem;
		}

		.attribute-table {
			thead {
				background: #fff;
			}
			tbody td {
				border: 1px solid #f5f5f5;
				padding: 4px 20px;
			}
			tbody tr {
				transition: all, 0.2s;
			}
			tbody tr:hover {
				background: #f5f5f5;
			}

			.ope-col {
				display: flex;
				flex-direction: row;
				gap: 5px;

				.operation-button {
					cursor: pointer;
					border: none;
					width: 30px;
					height: 30px;
					border-radius: 25px;
					background: #1c1c1c;
					color: #fff;
					align-items: center;
					display: inline-flex;
					justify-content: center;
				}
				.operation-button:before {
					line-height: 30px;
					width: 30px;
					text-align: center;
					font-style: normal;
					font-variant: normal;
					text-rendering: auto;
					-webkit-font-smoothing: antialiased;
				}
			}
		}
	}
</style>
