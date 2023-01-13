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
	import PowerTable, { type Data, type Instructs } from './powerTable/PowerTable.svelte';

	export let map: Map;
	export let sourceIds: string[];
	export let height: number;
	let controlHeader: number;
	$: tableBodyHeight = height - controlHeader;

	$: {
		console.log(tableBodyHeight, height, controlHeader);
	}

	let layers: string[];
	let selectedLayerId: string;

	let ptData: Data[] = [];
	let ptInstructs: Instructs[] = [];

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

		ptData = [];
		ptInstructs = [];
		const features = map.queryRenderedFeatures(undefined, { layers: [selectedLayerId] });
		ptData = features.map((f) => f.properties);

		if (ptData.length > 0) {
			ptInstructs = Object.keys(ptData[0]).map((key) => {
				return {
					key: key,
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
	<p class="subtitle is-6 p-0 m-0 pl-2">
		{ptData.length} feature{ptData.length > 1 ? 's' : ''} found.
	</p>
</div>

<div class="attribute-table" style="height:{tableBodyHeight}px;">
	<div class="MuonW PowerTable">
		<PowerTable bind:ptData bind:ptInstructs />
	</div>
</div>

<style lang="scss">
	@use 'bulma/css/bulma.css';

	.control-header {
		display: flex;
		align-items: center;
	}

	.attribute-table {
		overflow-y: auto;
	}
</style>
