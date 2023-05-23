<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import { Split } from '@geoffcox/svelte-splitter/src';
	import Fa from 'svelte-fa';
	import {
		faBars,
		faXmark,
		faCircleXmark,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';

	export let map: Map;
	export let isMenuShown = false;
	export let initialSidebarWidth = 380;
	export let minSidebarWidth = '300px';
	export let minMapWidth = '50%';
	export let height = 0;
	export let width = 0;
	export let sidebarOnLeft = true;
	export let isHorizontal = false;
	export let faIcon: IconDefinition = faBars;
	export let faIconSize: 'xs' | 'sm' | 'nm' | 'lg' | '2x' = 'nm';

	let menuButton: HTMLButtonElement;

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

	// eslint-disable-next-line
	function MapMenuControl() {}

	MapMenuControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		menuButton.addEventListener('click', () => {
			isMenuShown = !isMenuShown;
		});
		this.controlContainer.appendChild(menuButton);
		return this.controlContainer;
	};

	MapMenuControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	/*global MapMenuControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let mapMenuControl: MapMenuControl = null;

	$: {
		if (map) {
			if (mapMenuControl !== null && map.hasControl(mapMenuControl) === false) {
				map.addControl(mapMenuControl, position);
			}
		}
	}

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		mapMenuControl = new MapMenuControl();
		setSplitControl();
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

	const splitterChanged = () => {
		resizeMap();
	};

	const handleClose = () => {
		isMenuShown = false;
	};
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<button bind:this={menuButton}>
	{#if isMenuShown}
		<Fa icon={faXmark} />
	{:else}
		<Fa icon={faIcon} size={faIconSize} />
	{/if}
</button>

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
				{#if isMobile}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span class="span close-icon" on:click={handleClose}>
						<Fa icon={faCircleXmark} size="2x" color="#1c1c1c" />
					</span>
				{/if}
				<slot name="sidebar" />
			{:else}
				<slot name="map" />
			{/if}
		</div>

		<div slot="secondary" class="secondary-content">
			{#if sidebarOnLeft}
				<slot name="map" />
			{:else}
				{#if isMobile}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span class="span close-icon" on:click={handleClose}>
						<Fa icon={faIcon} size="2x" color="#1c1c1c" />
					</span>
				{/if}
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

			.close-icon {
				position: absolute;
				top: 0.5rem;
				right: 0.6rem;
				cursor: pointer;
				z-index: 10;
			}
		}

		.secondary-content {
			position: relative;
			height: 100%;
		}
	}
</style>
