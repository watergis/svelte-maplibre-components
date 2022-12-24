<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import { faFloppyDisk, faIndent } from '@fortawesome/free-solid-svg-icons';

	export let map: Map;
	export let layer: LayerSpecification;

	let layerLayoutStyleJson = JSON.stringify(layer.layout, null, 4);
	let layerPaintStyleJson = JSON.stringify(layer.paint, null, 4);

	let errorMessage: string;

	const handleSave = () => {
		const layoutStyle = JSON.parse(layerLayoutStyleJson);
		if (layoutStyle) {
			const keys = Object.keys(layoutStyle);
			for (const prop of keys) {
				map.setLayoutProperty(layer.id, prop, layoutStyle[prop]);
			}
		}
		layer.layout = layoutStyle;

		const paintStyle = JSON.parse(layerPaintStyleJson);
		if (paintStyle) {
			const keys = Object.keys(paintStyle);
			for (const prop of keys) {
				map.setPaintProperty(layer.id, prop, paintStyle[prop]);
			}
		}
		layer.paint = paintStyle;
	};

	const handleFormat = () => {
		layerLayoutStyleJson = JSON.stringify(JSON.parse(layerLayoutStyleJson), null, 4);
		layerPaintStyleJson = JSON.stringify(JSON.parse(layerPaintStyleJson), null, 4);
	};
</script>

<div class="menu-buttons">
	<span
		role="button"
		class="menu-button has-tooltip-bottom has-tooltip-arrow"
		data-tooltip="Apply to map"
		on:click={handleSave}
	>
		<Fa icon={faFloppyDisk} size="2x" />
	</span>

	<span
		role="button"
		class="menu-button has-tooltip-bottom has-tooltip-arrow"
		data-tooltip="Format JSON"
		on:click={handleFormat}
	>
		<Fa icon={faIndent} size="2x" />
	</span>
</div>

<p class="editor-title">Layout editor</p>

<textarea class="manual-editor" bind:value={layerLayoutStyleJson} />

<p class="editor-title">Paint editor</p>

<textarea class="manual-editor" bind:value={layerPaintStyleJson} />

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.menu-buttons {
		padding-bottom: 0.5rem;

		.menu-button {
			padding: 0.2rem;
			cursor: pointer;
			color: #1c1c1c;

			&:hover {
				color: hsl(204, 86%, 53%);
			}
		}
	}

	.editor-title {
		font-size: small;
		font-weight: bold;
		border-bottom: 2px solid gray;
		margin: 0;
		margin-bottom: 0.5rem;
	}

	.manual-editor {
		min-width: 100%;
		max-width: 100%;
		min-height: 100px;
		height: 200px;
		max-height: 300px;
		overflow-y: scroll;
		// resize: none;
	}
</style>
