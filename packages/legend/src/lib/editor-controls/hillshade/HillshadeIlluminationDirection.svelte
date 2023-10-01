<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'hillshade-illumination-direction');

		if (!value) {
			value = 335;
		}
		return value as number;
	};

	let value = getValue();
	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'hillshade-illumination-direction', value);
	};
</script>

<Slider bind:value min={0} max={359} step={1} unit="°" />
