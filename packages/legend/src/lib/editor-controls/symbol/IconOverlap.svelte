<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import type { Option } from '$lib/interfaces';
	import Options from '$lib/util/Options.svelte';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();

	let options: Option[] = $state([
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
	]);

	const getValue = () => {
		let value = $map.getLayoutProperty(layerId, 'icon-overlap');

		if (!value) {
			value = options[0].value;
		}
		return value as number[];
	};

	let value: number[] = $state(getValue());

	const setValue = () => {
		map.setLayoutProperty(layerId, 'icon-overlap', value);
	};
</script>

<Options bind:options bind:selectedValue={value} onchange={setValue} />
