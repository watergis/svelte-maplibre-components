<script lang="ts">
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import type { Option } from '$lib/interfaces';
	import Options from '$lib/util/Options.svelte';
	import { getContext } from 'svelte';

	const map = getMapContext();
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
