<script lang="ts">
	import type { Option } from '$lib/interfaces';
	import Options from '$lib/util/Options.svelte';
	import type { Map, LayerSpecification } from 'maplibre-gl';

	export let map: Map;
	export let layer: LayerSpecification;

	let options: Option[] = [
		{
			title: 'Solid',
			value: [1]
		},
		{
			title: ' dash',
			value: [10, 4]
		},
		{
			title: ' dash dot',
			value: [10, 3, 2, 3]
		},
		{
			title: ' dot',
			value: [1, 1]
		}
	];

	const getValue = () => {
		let value = map.getPaintProperty(layer.id, 'line-dasharray');

		if (!value) {
			value = options[0].value;
		}
		return value as number[];
	};

	let value: number[] = getValue();

	$: value, setValue();

	const setValue = () => {
		map?.setPaintProperty(layer.id, 'line-dasharray', value);
		const newLayer = map.getStyle().layers.find((l) => l.id === layer.id);
		if (newLayer) {
			layer = newLayer;
		}
	};
</script>

<Options bind:options bind:selectedValue={value} />
