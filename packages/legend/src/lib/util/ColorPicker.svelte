<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorPicker, { type RgbaColor, ChromeVariant } from 'svelte-awesome-color-picker';
	import chroma from 'chroma-js';
	import { createPopperActions } from 'svelte-popperjs';
	import { clickOutside } from 'svelte-use-click-outside';

	export let color: string;
	let rgba: RgbaColor;
	let showTooltip = false;

	const dispatch = createEventDispatcher();
	const [popperRef, popperContent] = createPopperActions({
		placement: 'right',
		strategy: 'fixed'
	});
	const extraOpts = {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8]
				}
			},
			{
				name: 'preventOverflow',
				options: {
					mainAxis: true
				}
			}
		]
	};

	$: color, setPickerColor();
	const setPickerColor = () => {
		// if (!color) return;
		const c = chroma(color);
		const rgb = c.rgb();
		rgba = { r: rgb[0], g: rgb[1], b: rgb[2], a: c.alpha() };
	};

	$: rgba, setMaplibreColor();
	const setMaplibreColor = () => {
		if (!rgba) return;
		color = chroma([rgba.r, rgba.g, rgba.b, rgba.a]).css();
		dispatch('change', {
			color
		});
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			showTooltip = !showTooltip;
		}
	};
</script>

<span
	class="paletter-control"
	role="button"
	tabindex="0"
	on:click={() => (showTooltip = !showTooltip)}
	on:keydown={handleKeydown}
	use:popperRef
>
	<div class="color-palette" alt={color} title={color} style="background: {color};" />
	<p class="label">Choose a color</p>
</span>

{#if showTooltip}
	<div id="tooltip" use:popperContent={extraOpts} use:clickOutside={() => (showTooltip = false)}>
		<ColorPicker
			bind:rgb={rgba}
			components={ChromeVariant}
			isPopup={true}
			isInput={false}
			isTextInput={false}
			isAlpha={true}
			toRight={true}
			isOpen={true}
		/>
	</div>
{/if}

<style lang="scss">
	.paletter-control {
		display: flex;
		align-items: center;
		cursor: pointer;
		margin: 0;
		padding: 0;

		.color-palette {
			border: 1px solid hsl(0, 0%, 0%);

			height: 20px;
			width: 20px;
			border-radius: 7.5px;

			&:hover {
				border: 1px solid hsl(204, 86%, 53%);
				padding: 0;
			}
		}

		.label {
			margin: 0;
			padding-left: 0.5rem;
			padding-right: 0;
			padding-top: 0;
			padding-bottom: 0;

			&:hover {
				color: hsl(204, 86%, 53%);
			}
		}
	}

	#tooltip {
		background: #fff;
		border-radius: 7.5px;
		border: 1px solid #ccc;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
		height: 270px;
		padding: 0;
		width: 280px;
		position: relative;
		z-index: 10;

		:global(.picker) {
			cursor: pointer;
		}

		:global(.slider) {
			cursor: pointer;
		}

		:global(.alpha) {
			cursor: pointer;
		}
	}
</style>
