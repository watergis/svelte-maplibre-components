<script lang="ts">
	import { Split } from '@watergis/svelte-splitter';
	import type { Map } from 'maplibre-gl';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let map: Map;
	export let isMenuShown = false;
	export let initialSidebarWidth = 380;
	export let minSidebarWidth = '300px';
	export let minMapWidth = '50%';
	export let height = 0;
	export let width = 0;
	export let sidebarOnLeft = true;
	export let isHorizontal = false;
	export let faIcon: string = 'fa-solid fa-bars';
	export let faIconSize: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '' = '';
	export let controlName = 'menu';
	export let showMenuButtonOnMap = true;

	let menuButton: HTMLDivElement;

	let innerWidth = 0;
	let innerHeight = 0;
	$: isMobile = innerWidth < 768 ? true : false;
	let splitControl: Split;
	let splitterSize = '0px';
	$: isMobile, setSplitControl();
	$: menuHeight = height > 0 ? height : innerHeight;
	$: menuWidth = width > 0 ? width : innerWidth;
	$: innerHeight, () => (menuHeight = innerHeight);
	$: innerWidth, () => (menuWidth = innerWidth);

	let minPrimaryWidth = sidebarOnLeft ? minSidebarWidth : minMapWidth;
	let minSecondaryWidth = sidebarOnLeft ? minMapWidth : minSidebarWidth;

	export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-left';

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

	$: if (map && menuButton) {
		initControl();
	}

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

	$: isMenuShown, opened();
	const opened = () => {
		setSplitControl();
	};

	$: if (splitControl) {
		opened();
	}

	const splitterChanged = (event) => {
		resizeMap();

		const { percent, primarySize, splitterSize, secondarySize, dragging } = event.detail;

		dispatch('changed', {
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
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if showMenuButtonOnMap && map}
	<div class="maplibregl-ctrl maplibregl-ctrl-group" bind:this={menuButton} hidden={isMenuShown}>
		<button
			class="maplibregl-ctrl-${controlName}"
			on:click={() => {
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
		<div slot="primary" class="primary-content">
			{#if sidebarOnLeft}
				<span
					class="span close-icon"
					role="button"
					tabindex="0"
					on:click={handleClose}
					on:keydown={handleEnterKey}
				>
					<i class="fa-solid fa-circle-xmark fa-xl" style="color: #1c1c1c"></i>
				</span>
				<slot name="sidebar" />
			{:else}
				<slot name="map" />
			{/if}
		</div>

		<div slot="secondary" class="secondary-content">
			{#if sidebarOnLeft}
				<slot name="map" />
			{:else}
				<span
					class="span close-icon"
					role="button"
					tabindex="0"
					on:click={handleClose}
					on:keydown={handleEnterKey}
				>
					<i class="fa-solid fa-circle-xmark fa-xl" style="color: #1c1c1c"></i>
				</span>
				<slot name="sidebar" />
			{/if}
		</div>
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
