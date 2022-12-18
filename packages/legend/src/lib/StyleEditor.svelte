<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Fa from 'svelte-fa';
	import { faPalette } from '@fortawesome/free-solid-svg-icons';
	import { createPopperActions } from 'svelte-popperjs';
	import { clickOutside } from 'svelte-use-click-outside';
	import Opacity from './editor-controls/Opacity.svelte';
	import HillshadeExaggeration from './editor-controls/HillshadeExaggeration.svelte';

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
		{#if layer.type !== 'hillshade'}
			<div class="field">
				<label class="label is-small">Opacity</label>
				<div class="control">
					<Opacity bind:map bind:layer />
				</div>
			</div>
		{/if}

		{#if layer.type === 'hillshade'}
			<div class="field">
				<label class="label is-small">Hillshade exaggeration</label>
				<div class="control">
					<HillshadeExaggeration bind:map bind:layer />
				</div>
			</div>
		{/if}

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
