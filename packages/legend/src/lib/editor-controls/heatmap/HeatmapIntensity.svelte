<script lang="ts">
	import type { PropertyType } from '$lib/interfaces';
	import Slider from '$lib/util/Slider.svelte';
	import type { Map, LayerSpecification } from 'maplibre-gl';
	import Control from '../Control.svelte';

	export let map: Map;
	export let layer: LayerSpecification;
	let type: PropertyType = 'paint';
	let property = 'heatmap-intensity';
	let defaultValue = 1;
	let value: number;
</script>

<Control bind:map bind:layer bind:type bind:property bind:defaultValue bind:value>
	<Slider bind:value min={0} max={10} step={0.1} unit="" />
</Control>
