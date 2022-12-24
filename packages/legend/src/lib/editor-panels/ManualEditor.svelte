<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import { faFloppyDisk, faIndent } from '@fortawesome/free-solid-svg-icons';

	export let map: Map;
	export let layer: LayerSpecification;

	let layerStyleJson = JSON.stringify(layer, null, 4);

	let errorMessage: string;

	const handleSave = () => {
		errorMessage = '';
		try {
			const layerStyle = JSON.parse(layerStyleJson);
			// layer = layerStyle
			if (layerStyle.filter) {
				map.setFilter(layerStyle.filter);
			}
			if (layerStyle.layout) {
				Object.keys(layerStyle.layout).forEach((prop) => {
					map.setLayoutProperty(layer.id, prop, layerStyle.layout[prop]);
				});
			}
			if (layerStyle.paint) {
				Object.keys(layerStyle.paint).forEach((prop) => {
					map.setPaintProperty(layer.id, prop, layerStyle.paint[prop]);
				});
			}
			layer = layerStyle;
		} catch (err) {
			if (err instanceof Error) {
				errorMessage = err.message;
			} else {
				throw err;
			}
		}
	};

	const handleFormat = () => {
		errorMessage = '';
		try {
			layerStyleJson = JSON.stringify(JSON.parse(layerStyleJson), null, 4);
		} catch (err) {
			if (err instanceof Error) {
				errorMessage = err.message;
			} else {
				throw err;
			}
		}
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

{#if errorMessage}
	<div class="notification is-danger p-1 mx-0 my-2">{errorMessage}</div>
{/if}

<textarea class="manual-editor" bind:value={layerStyleJson} />

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';
	@import 'bulma/bulma.sass';

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

	.manual-editor {
		min-width: 100%;
		max-width: 100%;
		min-height: 100px;
		max-height: 500px;
		overflow-y: scroll;
		// resize: none;
	}
</style>
