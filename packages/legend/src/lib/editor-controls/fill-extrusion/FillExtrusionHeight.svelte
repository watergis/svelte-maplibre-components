<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'fill-extrusion-height');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = $state(getValue());

	const setValue = () => {
		map.setPaintProperty(layerId, 'fill-extrusion-height', value);
	};
</script>

<Slider bind:value min={0} max={100} step={1} unit="m" onchange={setValue} />
