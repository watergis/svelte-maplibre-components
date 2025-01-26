<script lang="ts">
	import { getLayerIdContext } from '$lib/Layer.svelte';
	import { getMapContext } from '$lib/LegendPanel.svelte';
	import type { Option } from '$lib/interfaces';
	import Options from '$lib/util/Options.svelte';
	import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
	import yaml from 'js-yaml';
	import type { LayerSpecification } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';

	const map = getMapContext();
	let layerId: string = getLayerIdContext();
	let layer: LayerSpecification = $map
		.getStyle()
		.layers.find((l: LayerSpecification) => l.id === layerId) as LayerSpecification;

	let formatOptions: Option[] = $state([
		{
			title: 'YAML',
			value: 'yaml'
		},
		{
			title: 'JSON',
			value: 'json'
		}
	]);
	interface Props {
		selectedFormat: 'yaml' | 'json';
	}

	let { selectedFormat = $bindable() }: Props = $props();

	let layerLayoutStyle = $state('');
	let layerPaintStyle = $state('');

	onMount(() => {
		layerLayoutStyle = initialise('layout');
		layerPaintStyle = initialise('paint');
	});

	const initialise = (type: 'layout' | 'paint') => {
		if (selectedFormat === 'yaml') {
			return yaml.dump(layer[type]);
		} else {
			return JSON.stringify(layer[type], null, 4);
		}
	};

	const formatStyle = (type: 'layout' | 'paint') => {
		let target = layerPaintStyle;
		if (type === 'layout') {
			target = layerLayoutStyle;
		}
		if (!target) return '';
		let style = '';
		if (selectedFormat === 'yaml') {
			style = yaml.dump(JSON.parse(target));
		} else {
			style = JSON.stringify(yaml.load(target), null, 4);
		}
		return style;
	};

	const convertToStyleJson = (type: 'layout' | 'paint') => {
		let json: unknown;
		let target: string = layerLayoutStyle;
		if (type === 'paint') {
			target = layerPaintStyle;
		}
		if (selectedFormat === 'yaml') {
			json = yaml.load(target);
		} else {
			json = JSON.parse(target);
		}
		return json;
	};

	const handleSave = () => {
		const layoutStyle = convertToStyleJson('layout');
		if (layoutStyle) {
			const keys = Object.keys(layoutStyle);
			for (const prop of keys) {
				map.setLayoutProperty(layer.id, prop, layoutStyle[prop]);
			}
		}
		layer.layout = layoutStyle;

		const paintStyle = convertToStyleJson('paint');
		if (paintStyle) {
			const keys = Object.keys(paintStyle);
			for (const prop of keys) {
				map.setPaintProperty(layer.id, prop, paintStyle[prop]);
			}
		}
		layer.paint = paintStyle;
	};

	const handleFormat = () => {
		layerLayoutStyle = formatStyle('layout');
		layerPaintStyle = formatStyle('paint');
	};

	const handleEnterKey = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			e.target.click();
		}
	};
</script>

<div class="menu-buttons">
	<span
		role="button"
		tabindex="0"
		class="menu-button has-tooltip-bottom has-tooltip-arrow"
		data-tooltip="Apply to map"
		onclick={handleSave}
		onkeydown={handleEnterKey}
	>
		<Fa icon={faFloppyDisk} size="2x" />
	</span>

	<Options
		bind:options={formatOptions}
		bind:selectedValue={selectedFormat}
		onchange={handleFormat}
	/>
</div>

<p class="editor-title">Paint editor</p>

<textarea class="manual-editor" bind:value={layerPaintStyle}></textarea>

<p class="editor-title">Layout editor</p>

<textarea class="manual-editor" bind:value={layerLayoutStyle}></textarea>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.menu-buttons {
		display: flex;
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
