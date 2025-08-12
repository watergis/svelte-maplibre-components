<script lang="ts">
	import { Split } from '@watergis/svelte-splitter';
	import type { Map } from 'maplibre-gl';
	import {  onDestroy, onMount, untrack } from 'svelte';

	

	interface ChangeEventDetail {
		percent: number;
		primarySize: string;
		splitterSize: string;
		secondarySize: string;
		dragging: boolean;
	}

	interface Props {
		map: Map;
		isMenuShown?: boolean;
		initialSidebarWidth?: number;
		minSidebarWidth?: string;
		minMapWidth?: string;
		height?: number;
		width?: number;
		sidebarOnLeft?: boolean;
		isHorizontal?: boolean;
		faIcon?: string;
		faIconSize?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '';
		controlName?: string;
		showMenuButtonOnMap?: boolean;
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
		sidebar?: import('svelte').Snippet;
		mapControl?: import('svelte').Snippet;
		onchange?: (e: ChangeEventDetail) => void;
	}

	let {
		map=$bindable(),
		isMenuShown = $bindable(false),
		initialSidebarWidth = 380,
		minSidebarWidth = '300px',
		minMapWidth = '50%',
		height = $bindable(0),
		width = $bindable(0),
		sidebarOnLeft = true,
		isHorizontal = false,
		faIcon = 'fa-solid fa-bars',
		faIconSize = '',
		controlName = 'menu',
		showMenuButtonOnMap = true,
		position = 'top-left',
		sidebar,
		mapControl,
		onchange = () => {}
	}: Props = $props();

	let menuButton: HTMLDivElement = $state();

	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let splitControl: Split = $state();
	let splitterSize = $state('0px');

	let minPrimaryWidth = $state(sidebarOnLeft ? minSidebarWidth : minMapWidth);
	let minSecondaryWidth = $state(sidebarOnLeft ? minMapWidth : minSidebarWidth);

	function MapMenuControl() {}

	MapMenuControl.prototype.onAdd = function (map: Map) {
		this.map = map;
		return menuButton;
	};

	MapMenuControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map = undefined;
	};

	/*global MapMenuControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let mapMenuControl: MapMenuControl = null;

	onMount(() => {
		initControl();
	});


	const initControl = () => {
		if (map) {
			if (!(mapMenuControl && map.hasControl(mapMenuControl))) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				mapMenuControl = new MapMenuControl();
				map.addControl(mapMenuControl, position);
			}
		}
	};

	onDestroy(() => {
		if (map) {
			if (mapMenuControl && map.hasControl(mapMenuControl)) {
				map.removeControl(mapMenuControl);
			}
		}
	});

	const resizeMap = () => {
		if (!map) return;
		map.triggerRepaint();
		map.resize();
	};

	const setSplitControl = () => {
		if (!splitControl) return;

		if (isMenuShown === true) {
			if (isMobile) {
				if (sidebarOnLeft) {
					splitControl.setPercent(100);
					minSecondaryWidth = '0px';
				} else {
					splitControl.setPercent(0);
					minPrimaryWidth = '0px';
				}
				splitterSize = '0px';
			} else {
				if (sidebarOnLeft) {
					minPrimaryWidth = minSidebarWidth;
					minSecondaryWidth = minMapWidth;
					const widthPecent = (initialSidebarWidth / innerWidth) * 100;
					splitControl.setPercent(widthPecent);
				} else {
					minSecondaryWidth = minSidebarWidth;
					minPrimaryWidth = minMapWidth;
					const widthPecent = ((innerWidth - initialSidebarWidth) / innerWidth) * 100;
					splitControl.setPercent(widthPecent);
				}

				splitterSize = '10px';
				splitControl;
			}
		} else {
			if (sidebarOnLeft) {
				minPrimaryWidth = '0px';
				splitControl.setPercent(0);
			} else {
				minSecondaryWidth = '0px';
				splitControl.setPercent(100);
			}
			splitterSize = '0px';
		}
		resizeMap();
	};

	const opened = () => {
		setSplitControl();
	};


	const splitterChanged = (event) => {
		resizeMap();

		const { percent, primarySize, splitterSize, secondarySize, dragging } = event.detail;

		onchange( {
			percent,
			primarySize,
			splitterSize,
			secondarySize,
			dragging
		});
	};

	const handleClose = () => {
		isMenuShown = false;
	};

	const handleEnterKey = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			e.target.click();
		}
	};
	let isMobile = $derived(innerWidth < 768 ? true : false);
	$effect(() => {
		if (isMobile !== undefined) {
			untrack(() => {
				setSplitControl()
			});
		}
	});
	let menuHeight = $derived(height > 0 ? height : innerHeight);
	let menuWidth = $derived(width > 0 ? width : innerWidth);

	$effect(() => {
		if (map && menuButton) {
			untrack(()=>{
				initControl();
			})
		}
	});
	$effect(() => {
		if (isMenuShown !== undefined){
			untrack(() => {
				opened();
			});
		}
	});
	$effect(() => {
		if (splitControl){
			untrack(() => {
				opened();
			});
		}
	});

</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if showMenuButtonOnMap && map}
	<div class="maplibregl-ctrl maplibregl-ctrl-group" bind:this={menuButton} hidden={isMenuShown}>
		<button
			class="maplibregl-ctrl-${controlName}"
			onclick={() => {
				isMenuShown = !isMenuShown;
			}}
		>
			<i class="{faIcon} {faIconSize}"></i>
		</button>
	</div>
{/if}

<div class="split-container" style="height:{menuHeight}px;width:{menuWidth}px">
	<Split
		horizontal={isHorizontal}
		initialPrimarySize="0%"
		bind:minPrimarySize={minPrimaryWidth}
		bind:minSecondarySize={minSecondaryWidth}
		bind:splitterSize
		on:changed={splitterChanged}
		bind:this={splitControl}
	>
		{#snippet primary()}
				<div  class="primary-content">
				{#if sidebarOnLeft}
					<span
						class="span close-icon"
						role="button"
						tabindex="0"
						onclick={handleClose}
						onkeydown={handleEnterKey}
					>
						<i class="fa-solid fa-circle-xmark fa-xl" style="color: #1c1c1c"></i>
					</span>
					{@render sidebar?.()}
				{:else}
					{@render mapControl?.()}
				{/if}
			</div>
			{/snippet}

		{#snippet secondary()}
				<div  class="secondary-content">
				{#if sidebarOnLeft}
					{@render mapControl?.()}
				{:else}
					<span
						class="span close-icon"
						role="button"
						tabindex="0"
						onclick={handleClose}
						onkeydown={handleEnterKey}
					>
						<i class="fa-solid fa-circle-xmark fa-xl" style="color: #1c1c1c"></i>
					</span>
					{@render sidebar?.()}
				{/if}
			</div>
			{/snippet}
	</Split>
</div>

<style lang="scss">
	.split-container {
		.primary-content {
			position: relative;
			height: 100%;
		}

		.secondary-content {
			position: relative;
			height: 100%;
		}

		.close-icon {
			position: absolute;
			top: 0.5em;
			right: 0.3em;
			cursor: pointer;
			z-index: 10;
		}
	}
</style>
