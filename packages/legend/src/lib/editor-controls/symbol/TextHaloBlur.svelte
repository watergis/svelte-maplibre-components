<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import Slider from '$lib/util/Slider.svelte';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'text-halo-blur');

		if (!value) {
			value = 0;
		}
		return value as number;
	};

	let value = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'text-halo-blur', value);
	};
</script>

<Slider bind:value min={0} max={10} step={1} unit="px" />
