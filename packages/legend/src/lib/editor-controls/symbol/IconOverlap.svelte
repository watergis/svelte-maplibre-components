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
			title: 'Never',
			value: 'never'
		},
		{
			title: 'always',
			value: 'always'
		},
		{
			title: 'Cooperative',
			value: 'cooperative'
		}
	];

	const getValue = () => {
		let value = $map.getLayoutProperty(layer.id, 'icon-overlap');

		if (!value) {
			value = options[0].value;
		}
		return value as number[];
	};

	let value: number[] = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setLayoutProperty(layer.id, 'icon-overlap', value);
	};
</script>

<Options bind:options bind:selectedValue={value} />
