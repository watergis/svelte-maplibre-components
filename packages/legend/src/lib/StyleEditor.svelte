<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import { faPalette } from '@fortawesome/free-solid-svg-icons';
	import { createPopperActions } from 'svelte-popperjs';
	import { clickOutside } from 'svelte-use-click-outside';
	import Opacity from './editor-controls/Opacity.svelte';
	import HillshadeExaggeration from './editor-controls/HillshadeExaggeration.svelte';
	import ColorPicker from './editor-controls/ColorPicker.svelte';

	export let map: Map;
	export let layer: LayerSpecification;

	const [popperRef, popperContent] = createPopperActions({
		placement: 'right',
		strategy: 'fixed'
	});
	const extraOpts = {
		modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
	};

	let showTooltip = false;
</script>

<span
	tabindex="0"
	role="button"
	class="palette-button has-tooltip-left"
	data-tooltip="Change layer style"
	use:popperRef
	on:click={() => (showTooltip = !showTooltip)}
>
	<Fa icon={faPalette} size="lg" />
</span>

{#if showTooltip}
	<div id="tooltip" use:popperContent={extraOpts} use:clickOutside={() => (showTooltip = false)}>
		<div class="editor-contents">
			{#if layer.type !== 'hillshade'}
				<div class="field">
					<label class="label is-small">Opacity</label>
					<div class="control">
						<Opacity bind:map bind:layer />
					</div>
				</div>
			{/if}

			{#if layer.type === 'background'}
				<div class="field">
					<label class="label is-small">Background color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="background-color" />
					</div>
				</div>
			{:else if layer.type === 'fill'}
				<div class="field">
					<label class="label is-small">Fill color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="fill-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Fill outline color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="fill-outline-color" />
					</div>
				</div>
			{:else if layer.type === 'line'}
				<div class="field">
					<label class="label is-small">Line color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="line-color" />
					</div>
				</div>
			{:else if layer.type === 'symbol'}
				<div class="field">
					<label class="label is-small">Icon color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="icon-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Icon halo color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="icon-halo-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Text color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="text-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Text halo color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="text-halo-color" />
					</div>
				</div>
			{:else if layer.type === 'circle'}
				<div class="field">
					<label class="label is-small">Circle color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="circle-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Circle stroke color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="circle-stroke-color" />
					</div>
				</div>
			{:else if layer.type === 'fill-extrusion'}
				<div class="field">
					<label class="label is-small">Fill extruction color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="fill-extrusion-color" />
					</div>
				</div>
			{:else if layer.type === 'hillshade'}
				<div class="field">
					<label class="label is-small">Hillshade exaggeration</label>
					<div class="control">
						<HillshadeExaggeration bind:map bind:layer />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Hillshade accent color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="hillshade-accent-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Hillshade highlight color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="hillshade-highlight-color" />
					</div>
				</div>
				<div class="field">
					<label class="label is-small">Hillshade shadow color</label>
					<div class="control">
						<ColorPicker bind:map bind:layer propertyName="hillshade-shadow-color" />
					</div>
				</div>
			{/if}
		</div>
		<div id="arrow" data-popper-arrow />
	</div>
{/if}

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';
	@import 'bulma/bulma.sass';

	.palette-button {
		cursor: pointer;
		margin-right: 0.5rem;
	}

	.editor-contents {
		height: auto;
		overflow-y: auto;
	}

	#tooltip {
		background: #fff;
		border-radius: 7.5px;
		border: 1px solid #ccc;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
		font-size: 13px;
		width: 300px;
		max-width: 350px;
		padding: 15px;
		position: relative;
		z-index: 10;
	}

	#arrow,
	#arrow::before {
		background: #fff;
		height: 18px;
		left: -4.5px;
		position: absolute;
		width: 18px;
		z-index: 1;
	}

	#arrow {
		visibility: visible;
	}

	#arrow::before {
		border-bottom: 1px solid #ccc;
		border-left: 1px solid #ccc;
		content: '';
		transform: rotate(45deg);
		visibility: visible;
	}

	[data-tooltip]:hover:before,
	[data-tooltip]:hover:after,
	[data-tooltip]:focus:before,
	[data-tooltip]:focus:after {
		visibility: visible;
		opacity: 1;
	}
</style>
