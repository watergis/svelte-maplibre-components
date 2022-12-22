<script lang="ts">
	import type { Option } from '$lib/interfaces';
	import Options from '$lib/util/Options.svelte';
	import type { Map, LayerSpecification } from 'maplibre-gl';

	export let map: Map;
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
		let value = map.getPaintProperty(layer.id, 'raster-resampling');

		if (!value) {
			value = options[0].value;
		}
		return value as string;
	};

	let value: string = getValue();

	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'raster-resampling', value);
	};
</script>

<Options bind:options bind:selectedValue={value} />
