<script lang="ts">
	import type {
		FillLayerSpecification,
		HeatmapLayerSpecification,
		LineLayerSpecification,
		Map,
		SymbolLayerSpecification,
		VectorSourceSpecification
	} from 'maplibre-gl';
	import { distinct } from './util/distinct';

	export let map: Map;
	export let sourceIds: string[];
	export let height: number;
	let controlHeader: number;
	let tableHeight: number;
	$: tableBodyHeight = height - controlHeader - tableHeight;

	let layers: string[];
	let selectedLayerId: string;

	let rows: { [key: string]: string }[] = [];
	let columns: { [key: string]: string }[] = [];

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
			if (['symbol', 'line', 'fill', 'heatmap'].includes(layer.type)) {
				const vectorLayer:
					| SymbolLayerSpecification
					| LineLayerSpecification
					| FillLayerSpecification
					| HeatmapLayerSpecification = layer as
					| SymbolLayerSpecification
					| LineLayerSpecification
					| FillLayerSpecification
					| HeatmapLayerSpecification;
				if (!sourceIds.includes(vectorLayer.source)) return;
				const id = vectorLayer['source-layer'];
				if (!id) return;

				const source = style.sources[vectorLayer.source] as VectorSourceSpecification;
				let minzoom = vectorLayer.minzoom;
				if (!minzoom) {
					minzoom = source.minzoom ?? 0;
				}
				if (!(minzoom <= zoom)) return;
				ids.push(id);
			}
		});
		layers = ids.map((id) => id).filter(distinct);
	};

	$: selectedLayerId, updateTable();

	const updateTable = () => {
		if (!selectedLayerId) return;
		if (!map) return;

		rows = [];
		columns = [];
		const features = map.queryRenderedFeatures(undefined, { layers: [selectedLayerId] });
		rows = features.map((f) => f.properties);

		if (rows.length > 0) {
			columns = Object.keys(rows[0]).map((key) => {
				return {
					name: key,
					title: key
				};
			});
		}
	};
</script>

<div class="control-header pb-2" bind:clientHeight={controlHeader}>
	{#if layers && layers.length > 0}
		<p class="title is-6 p-0 m-0 pr-2">Layer:</p>
		<select class="select" bind:value={selectedLayerId}>
			{#each layers as id}
				<option value={id}>{id}</option>
			{/each}
		</select>
	{/if}
	<p class="subtitle is-6 p-0 m-0 pl-2">{rows.length} feature{rows.length > 1 ? 's' : ''} found.</p>
</div>

<table class="attribute-table table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
	<thead bind:clientHeight={tableHeight}>
		<tr>
			{#each columns as col}
				<th><p class="nowrap">{col.title}</p></th>
			{/each}
		</tr>
	</thead>
	<tbody style="height:{tableBodyHeight}px;">
		{#if rows.length === 0}
			<div class="notification is-info is-light">
				No features found in current map area. Please try to move map.
			</div>
		{:else}
			{#each rows as row}
				<tr>
					{#each columns as col}
						<td><p class="text-wrap">{row[col.name]}</p></td>
					{/each}
				</tr>
			{/each}
		{/if}
	</tbody>
</table>

<style lang="scss">
	@use 'bulma/css/bulma.css';

	.control-header {
		display: flex;
		align-items: center;
	}

	table tbody {
		display: block;
		max-height: 300px;
		overflow-y: scroll;
	}

	table thead,
	table tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	.nowrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.text-wrap {
		white-space: break-spaces;
		overflow: hidden;
		text-overflow: unset;
	}
</style>
