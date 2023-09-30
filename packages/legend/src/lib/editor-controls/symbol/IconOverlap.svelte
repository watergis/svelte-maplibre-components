<script lang="ts">
	import type { Option } from '$lib/interfaces';
	import type { createMapStore } from '$lib/stores';
	import Options from '$lib/util/Options.svelte';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');
	let layerId: string = getContext('layerId');

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
		let value = $map.getLayoutProperty(layerId, 'icon-overlap');

		if (!value) {
			value = options[0].value;
		}
		return value as number[];
	};

	let value: number[] = getValue();

	$: value, setValue();

	const setValue = () => {
		map.setLayoutProperty(layerId, 'icon-overlap', value);
	};
</script>

<Options bind:options bind:selectedValue={value} />
