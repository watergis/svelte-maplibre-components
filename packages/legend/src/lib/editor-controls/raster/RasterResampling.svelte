<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import type { Option } from '$lib/interfaces';
	import Options from '$lib/util/Options.svelte';
	import { getContext } from 'svelte';

	const map = getMapContext();
	let layerId: string = getContext('layerId');

	let options: Option[] = [
		{
			title: 'linear',
			value: 'linear'
		},
		{
			title: 'nearest',
			value: 'nearest'
		}
	];

	const getValue = () => {
		let value = $map.getPaintProperty(layerId, 'raster-resampling');

		if (!value) {
			value = options[0].value;
		}
		return value as string;
	};

	let value: string = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layerId, 'raster-resampling', value);
	};
</script>

<Options bind:options bind:selectedValue={value} />
