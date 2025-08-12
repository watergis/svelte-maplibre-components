<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'heatmap-intensity');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = $state(getValue());

	const setValue = () => {
		map.setPaintProperty(layerId, 'heatmap-intensity', value);
	};
</script>

<Slider bind:value min={0} max={10} step={0.1} unit="" onchange={setValue} />
