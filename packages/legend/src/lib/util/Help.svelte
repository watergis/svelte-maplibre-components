<script lang="ts">
	import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	const MAPLIBRE_STYLE_LAYER_URL = 'https://maplibre.org/maplibre-style-spec/layers/';

	interface Props {
		type?: 'paint' | 'layout' | undefined;
		layerType:
			| 'background'
			| 'fill'
			| 'line'
			| 'symbol'
			| 'raster'
			| 'circle'
			| 'fill-extrusion'
			| 'heatmap'
			| 'hillshade';
		property?: string | undefined;
		// svelte-fa size. https://cweili.github.io/svelte-fa/
		size?: 'xs' | 'sm' | 'lg' | '2x' | '2.5x' | '5x' | '7x' | '10x';
	}

	let {
		type = $bindable(),
		layerType = $bindable(),
		property = $bindable(),
		size = $bindable('sm')
	}: Props = $props();

	let url: string = $state('');

	$effect(() => {
		if (type && layerType && property) {
			url = `${MAPLIBRE_STYLE_LAYER_URL}#${type}-${layerType}-${property}`;
		} else if (layerType && !type && !property) {
			url = `${MAPLIBRE_STYLE_LAYER_URL}#${layerType}`;
		} else {
			url = MAPLIBRE_STYLE_LAYER_URL;
		}
	});
</script>

<a class="help" href={url} target="_blank" rel="noreferrer" role="button">
	<Fa icon={faCircleQuestion} {size} />
</a>

<style lang="scss">
	.help {
		padding: 0;
		padding-left: 0.2rem;
		color: gray;

		&:hover {
			color: hsl(204, 86%, 53%);
		}
	}
</style>
