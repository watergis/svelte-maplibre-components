<script lang="ts">
	import type {
		Map,
		HeatmapLayerSpecification,
		SymbolLayerSpecification,
		LayerSpecification
	} from 'maplibre-gl';

	export let map: Map;
	export let layer: LayerSpecification;
	let heatmapLayerId = `${layer.id} heatmap`;
	let isHeatmapCreated = map.getLayer(heatmapLayerId) ? true : false;

	$: if (isHeatmapCreated === true) {
		createHeatmap();
	}

	$: if (!isHeatmapCreated) {
		deleteHeatmap();
	}

	const createHeatmap = () => {
		if (map.getLayer(heatmapLayerId)) return;

		const symbolLayer: SymbolLayerSpecification = layer as SymbolLayerSpecification;

		const heatmapLayer: HeatmapLayerSpecification = {
			id: heatmapLayerId,
			type: 'heatmap',
			source: symbolLayer.source,
			'source-layer': symbolLayer['source-layer'],
			layout: {
				visibility: 'visible'
			},
			paint: {
				'heatmap-color': [
					'interpolate',
					['linear'],
					['heatmap-density'],
					0,
					'rgba(0, 0, 255, 0)',
					0.1,
					'royalblue',
					0.3,
					'cyan',
					0.5,
					'lime',
					0.7,
					'yellow',
					1,
					'red'
				],
				'heatmap-intensity': 1,
				'heatmap-opacity': 1,
				'heatmap-radius': 30,
				'heatmap-weight': 1
			}
		};
		heatmapLayer.minzoom = symbolLayer.maxzoom ?? 0;
		heatmapLayer.maxzoom = symbolLayer.maxzoom ?? 24;

		map.addLayer(heatmapLayer, symbolLayer.id);
	};

	const deleteHeatmap = () => {
		if (map.getLayer(heatmapLayerId)) {
			map.removeLayer(heatmapLayerId);
		}
	};
</script>

<div class="field">
	<input
		id="heatmapToggle"
		type="checkbox"
		name="heatmapToggle"
		class="switch"
		bind:checked={isHeatmapCreated}
	/>
	<label class="switch-label" for="heatmapToggle"
		>{isHeatmapCreated ? 'Delete heatmap' : 'Create heatmap'}</label
	>
</div>

<style lang="scss">
	@use 'bulma-switch/dist/css/bulma-switch.min.css';

	.switch-label {
		&:hover {
			color: hsl(204, 86%, 53%);
		}
	}
</style>
