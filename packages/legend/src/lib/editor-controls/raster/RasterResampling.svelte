<script lang="ts">
	import type { Option } from '$lib/interfaces';
	import type { createMapStore } from '$lib/stores';
	import Options from '$lib/util/Options.svelte';
	import type { LayerSpecification } from 'maplibre-gl';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');

	export let layer: LayerSpecification;

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
		let value = $map.getPaintProperty(layer.id, 'raster-resampling');

		if (!value) {
			value = options[0].value;
		}
		return value as string;
	};

	let value: string = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setPaintProperty(layer.id, 'raster-resampling', value);
	};
</script>

<Options bind:options bind:selectedValue={value} />
