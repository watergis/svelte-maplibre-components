<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'line-width');

		if (!value) {
			value = 1;
		}
		return value as number;
	};

	let value = $state(getValue());

	const setValue = () => {
		if (!value) return;
		map.setPaintProperty(layerId, 'line-width', value);
	};
</script>

<Slider bind:value min={0} max={20} step={1} unit="px" onchange={setValue} />
