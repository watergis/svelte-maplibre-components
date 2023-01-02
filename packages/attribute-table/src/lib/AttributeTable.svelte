<script lang="ts">
	import type {
		FillLayerSpecification,
		HeatmapLayerSpecification,
		LineLayerSpecification,
		Map,
		SymbolLayerSpecification
	} from 'maplibre-gl';
	import { distinct } from './util/distinct';
	import SvelteTable from 'svelte-table';

	export let map: Map;
	export let sourceIds: string[];

	let layers: string[];
	let selectedLayerId: string;

	let rows: { [key: string]: string }[] = [];
	let columns: { [key: string]: string }[] = [];

	$: if (map) {
		map.on('sourcedata', (e) => {
			if (e.isSourceLoaded) {
				layers = getLayerList();
			}
		});
	}

	const getLayerList = () => {
		const ids: string[] = [];
		map.getStyle().layers.forEach((layer) => {
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
				ids.push(id);
			}
		});
		return ids.map((id) => id).filter(distinct);
	};

	$: selectedLayerId, updateTable();

	const updateTable = () => {
		if (!selectedLayerId) return;
		if (!map) return;

		rows = [];
		columns = [];
		sourceIds.forEach((id) => {
			const features = map.querySourceFeatures(id, { sourceLayer: selectedLayerId });
			rows = [...rows, ...features.map((f) => f.properties)];
		});
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

{#if layers && layers.length > 0}
	<select class="layer-select" bind:value={selectedLayerId}>
		{#each layers as id}
			<option value={id}>{id}</option>
		{/each}
	</select>
{/if}

<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
	<thead>
		<tr>
			{#each columns as col}
				<th>{col.title}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rows as row}
			<tr>
				{#each columns as col}
					<td>{row[col.name]}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	@import 'bulma/bulma.sass';

	.layer-select {
		cursor: pointer;
		width: fit-content;
		height: 40px;
		border-radius: 4px;
		border-color: #485fc7;
		box-sizing: border-box;
		font-size: 1em;
		padding: 10px;
		margin-bottom: 0.5rem;

		select {
			width: fit-content;
			border-radius: 4px;
			border-color: #485fc7;
			box-sizing: border-box;
			background: transparent;
			-webkit-appearance: none;
			cursor: pointer;
			background: #fff
				url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2011%2011%22%3E%3Cpath%20d%3D%22M4.33%208.5L0%201L8.66%201z%22%20fill%3D%22%23666%22%2F%3E%3C%2Fsvg%3E')
				right 10px center no-repeat;
			padding: 12px 35px 12px 11px;
			color: #000;

			/* Firefox hide arrow */
			-moz-appearance: none;
			text-indent: 0.01px;
			text-overflow: '';
		}
		/* IE10 hide arrow */
		select::-ms-expand {
			display: none;
		}
	}
</style>
