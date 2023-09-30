<script lang="ts">
	import type { Option } from '$lib/interfaces';
	import type { createMapStore } from '$lib/stores';
	import Options from '$lib/util/Options.svelte';
	import { getContext } from 'svelte';

	let map: ReturnType<typeof createMapStore> = getContext('map');
	let layerId: string = getContext('layerId');

	let options: Option[] = [
		{
			title: 'Solid',
			value: ''
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
		let value = $map.getPaintProperty(layerId, 'line-dasharray');

		if (!value) {
			value = options[0].value;
		}
		return value as number[];
	};

	let value: number[] = getValue();

	$: value, setValue();

	const setValue = () => {
		if (value) {
			map.setPaintProperty(layerId, 'line-dasharray', value);
		} else {
			map.setPaintProperty(layerId, 'line-dasharray', undefined);
		}
	};
</script>

<Options bind:options bind:selectedValue={value} />
