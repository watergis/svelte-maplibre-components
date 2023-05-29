<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		LngLatBounds,
		Marker,
		type FillLayerSpecification,
		type HeatmapLayerSpecification,
		type LineLayerSpecification,
		type Map,
		type MapGeoJSONFeature,
		type SymbolLayerSpecification,
		type VectorSourceSpecification,
		type LngLatLike
	} from 'maplibre-gl';
	import { distinct } from './util';
	import { Datatable } from 'svelte-simple-datatables';
	import Fa from 'svelte-fa';
	import { faMagnifyingGlassPlus, faRotate } from '@fortawesome/free-solid-svg-icons';

	export let map: Map;
	export let rowsPerPage = 25;
	export let minZoom = 14;
	let layers: string[];
	let selectedSourceLayerId: string;

	let containerHeight = 0;
	let headerHeight = 0;

	const settings = {
		sortable: true,
		pagination: true,
		scrollY: true,
		rowsPerPage: rowsPerPage,
		columnFilter: true,
		css: true,
		labels: {
			search: 'Search...', // search input placeholer
			filter: 'Filter', // filter inputs placeholder
			noRows: 'No entries to found',
			info: 'Showing {start} to {end} of {rows} entries',
			previous: 'Previous',
			next: 'Next'
		},
		blocks: {
			searchInput: true,
			paginationButtons: true,
			paginationRowCount: true
		}
	};

	let features: MapGeoJSONFeature[] = [];
	let data: { [key: string]: string }[] = [];
	let rows = writable<{ [key: string]: string }[]>([]);
	let columns: { id: string; label: string }[] = [];

	let zoomedMarker: Marker;
	let reloadButtonDiabled = false;

	$: if (map) {
		map.on('sourcedata', (e) => {
			if (e.isSourceLoaded) {
				getLayerList();
			}
		});
		map.on('zoomend', () => {
			reloadButtonDiabled = false;
		});
		map.on('moveend', () => {
			reloadButtonDiabled = false;
		});
	}

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

	$: selectedSourceLayerId, updateTable();

	const getLayerIdsBySourceLayer = (sourceLayerId: string) => {
		const style = map.getStyle();
		const layers = style.layers.filter((l) => l['source-layer'] === sourceLayerId);
		const ids = layers.map((l) => l.id);
		return ids;
	};

	const updateTable = () => {
		if (!selectedSourceLayerId) return;
		if (!map) return;

		reloadButtonDiabled = true;

		const ids = getLayerIdsBySourceLayer(selectedSourceLayerId);
		if (ids.length > 0) {
			features = map.queryRenderedFeatures(undefined, { layers: ids });
			data = features.map((f) => f.properties);

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
				return;
			}
		}

		$rows = [];
		features = [];
		data = [];
		columns = [];
	};

	const handleReload = () => {
		getLayerList();
		updateTable();
		reloadButtonDiabled = true;
	};

	const zoomToFeature = (feature?: MapGeoJSONFeature) => {
		if (!feature) return;
		const geometry = feature.geometry;

		const type = geometry.type.toLowerCase();
		let center: LngLatLike;
		if (type === 'point') {
			const point: number[] = geometry.coordinates as number[];
			center = [point[0], point[1]];
			let currentZoom = map.getZoom();
			if (currentZoom < minZoom) {
				currentZoom = minZoom;
			}
			map.flyTo({
				center: center,
				zoom: currentZoom
			});
		} else if (type === 'linestring') {
			const coordinates = geometry.coordinates;
			const bounds = coordinates.reduce(function (bounds, coord) {
				return bounds.extend(coord);
			}, new LngLatBounds(coordinates[0], coordinates[0]));

			map.fitBounds(bounds, {
				padding: 20
			});

			center = coordinates[parseInt(`${coordinates.length / 2}`)];
		} else if (type === 'polygon') {
			const coordinates = geometry.coordinates[0];
			const bounds = coordinates.reduce(function (bounds, coord) {
				return bounds.extend(coord);
			}, new LngLatBounds(coordinates[0], coordinates[0]));

			map.fitBounds(bounds, {
				padding: 20
			});

			console.log(bounds);
			center = [(bounds._ne.lng + bounds._sw.lng) / 2, (bounds._ne.lat + bounds._sw.lat) / 2];
		}

		if (zoomedMarker) {
			zoomedMarker.remove();
		}
		zoomedMarker = new Marker().setLngLat(center).addTo(map);
	};
</script>

<div class="attribute-table-container" bind:clientHeight={containerHeight}>
	<aside class="header" bind:clientHeight={headerHeight}>
		<select class="layer-select" bind:value={selectedSourceLayerId}>
			{#if layers && layers.length > 0}
				{#each layers as id}
					<option value={id}>{id}</option>
				{/each}
			{/if}
		</select>
		<button class="reload-button" on:click={handleReload} disabled={reloadButtonDiabled}>
			<Fa icon={faRotate} size="nm" />
		</button>
	</aside>

	<div class="attribute-table">
		<section style="height: {containerHeight - headerHeight * 2}px">
			{#if data.length === 0}
				<p class="no-data">
					No data to be shown in the selected layer and rendered area. Please select another layer
					or move the map.
				</p>
			{:else}
				{#key data}
					<Datatable {settings} {data} bind:dataRows={rows}>
						<thead>
							<tr>
								<th>Operation</th>
								{#each columns as col}
									<th data-key={col.id}>{col.label}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#if rows}
								{#each $rows as row}
									{@const feature = features.find((f) => f.properties === row)}
									<tr>
										<td>
											<button
												class="operation-button"
												on:click={() => {
													zoomToFeature(feature);
												}}
											>
												<Fa icon={faMagnifyingGlassPlus} size="lg" />
											</button>
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
							{/if}
						</tbody>
					</Datatable>
				{/key}
			{/if}
		</section>
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
			margin-left: 32px;
		}

		.layer-select {
			cursor: pointer;
			width: 196px;
			height: 26px;
			margin-bottom: 0.5rem;

			display: inline-flex;
			align-items: center;
			position: relative;
		}

		.layer-select::after {
			position: absolute;
			right: 15px;
			width: 10px;
			height: 7px;
			background-color: #535353;
			clip-path: polygon(0 0, 100% 0, 50% 100%);
			content: '';
			pointer-events: none;
		}

		.layer-select select {
			appearance: none;
			min-width: 230px;
			height: 2.8em;
			padding: 0.4em calc(0.8em + 30px) 0.4em 0.8em;
			border: 1px solid #cccccc;
			border-radius: 3px;
			background-color: #fff;
			color: #333333;
			font-size: 1em;
			cursor: pointer;
		}

		.no-data {
			margin-left: 32px;
		}

		.reload-button {
			cursor: pointer;
			border: none;
			width: 27px;
			height: 27px;
			border-radius: 5px;
			background: #1c1c1c;
			color: #ffffff;
			margin-left: 0.3rem;
		}

		.reload-button:disabled {
			background: #a5a5a5;
			cursor: default;
		}

		.reload-button:before {
			line-height: 27px;
			width: 27px;
			text-align: center;
			font-style: normal;
			font-variant: normal;
			text-rendering: auto;
			-webkit-font-smoothing: antialiased;
		}

		.attribute-table {
			aside {
				display: flex;
				justify-content: space-between;
				padding: 8px 16px;
				background: #fff;
				border-radius: 8px;
				margin: 8px 0;
			}
			th:first-child {
				width: 72px;
			}
			td {
				text-align: center;
				padding: 4px 0;
			}

			.operation-button {
				cursor: pointer;
				border: none;
				width: 30px;
				height: 30px;
				border-radius: 25px;
				background: #1c1c1c;
				color: #fff;
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
</style>
