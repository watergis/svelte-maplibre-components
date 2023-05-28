<script lang="ts">
	import { writable } from 'svelte/store';
	import type {
		FillLayerSpecification,
		HeatmapLayerSpecification,
		LineLayerSpecification,
		Map,
		SymbolLayerSpecification,
		VectorSourceSpecification
	} from 'maplibre-gl';
	import { distinct } from './util';
	import { Datatable } from 'svelte-simple-datatables';

	export let map: Map;
	export let rowsPerPage = 25;
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

	let data: { [key: string]: string }[] = [];
	let rows = writable<{ [key: string]: string }[]>([]);
	let columns: { id: string; label: string }[] = [];

	$: if (map) {
		map.on('sourcedata', (e) => {
			if (e.isSourceLoaded) {
				getLayerList();
			}
		});
		map.on('zoomend', getLayerList);
		map.on('zoomend', updateTable);
		map.on('moveend', updateTable);
	}

	const getLayerList = () => {
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

		const ids = getLayerIdsBySourceLayer(selectedSourceLayerId);
		if (ids.length > 0) {
			const features = map.queryRenderedFeatures(undefined, { layers: ids });
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

		data = [];
		columns = [];
		$rows = [];
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
	</aside>

	<div class="attribute-table">
		<section style="height: {containerHeight - headerHeight * 2}px">
			{#if data.length === 0}
				<p class="no-data">No data to be shown. Try to select other layer for attribute table.</p>
			{:else}
				{#key data}
					<Datatable {settings} {data} bind:dataRows={rows}>
						<!-- {#key data} -->
						<thead>
							<tr>
								<!-- {#key columns} -->
								{#each columns as col}
									<th data-key={col.id}>{col.label}</th>
								{/each}
								<!-- {/key} -->
							</tr>
						</thead>
						<tbody>
							{#if rows}
								{#each $rows as row}
									<tr>
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
						<!-- {/key} -->
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
		}
	}
</style>
