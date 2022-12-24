<script lang="ts">
	import Fa from 'svelte-fa';
	import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

	const MAPLIBRE_STYLE_LAYER_URL = 'https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/';

	export let type: 'paint' | 'layout' | undefined = undefined;
	export let layerType:
		| 'background'
		| 'fill'
		| 'line'
		| 'symbol'
		| 'raster'
		| 'circle'
		| 'fill-extrusion'
		| 'heatmap'
		| 'hillshade';
	export let property: string | undefined = undefined;

	let url: string;

	$: {
		if (type && layerType && property) {
			url = `${MAPLIBRE_STYLE_LAYER_URL}#${type}-${layerType}-${property}`;
		} else if (layerType && !type && !property) {
			url = `${MAPLIBRE_STYLE_LAYER_URL}#${layerType}`;
		} else {
			url = MAPLIBRE_STYLE_LAYER_URL;
		}
	}
</script>

<a class="help" href={url} target="_blank" rel="noreferrer" role="button">
	<Fa icon={faCircleQuestion} size="sm" />
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
