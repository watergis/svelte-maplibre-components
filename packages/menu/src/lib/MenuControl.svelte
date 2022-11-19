<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import { Split } from '@geoffcox/svelte-splitter/src';
	import './style/fa/css/all.css';

	export let map: Map;
	export let isMenuShown = false;
	export let initialPrimaryWidth = 380;
	export let minPrimaryWidth = '300px';
	export let minSecondaryWidth = '50%';
	export let height = 0;
	export let width = 0;

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
				splitControl.setPercent(100);
				splitterSize = '0px';
			} else {
				const widthPecent = (initialPrimaryWidth / innerWidth) * 100;
				splitControl.setPercent(widthPecent);
				splitterSize = '10px';
				splitControl;
			}
		} else {
			splitControl.setPercent(0);
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
		<i class="fas fa-xmark" />
	{:else}
		<i class="fas fa-bars" />
	{/if}
</button>

<div class="split-container" style="height:{menuHeight}px;width:{menuWidth}px">
	<Split
		initialPrimarySize="0%"
		minPrimarySize={isMenuShown ? `${minPrimaryWidth}` : '0px'}
		minSecondarySize={isMobile ? '0px' : minSecondaryWidth}
		{splitterSize}
		on:changed={splitterChanged}
		bind:this={splitControl}
	>
		<div slot="primary" class="primary-content">
			{#if isMobile}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span class="span close-icon" on:click={handleClose}>
					<i class="fas fa-xmark fa-lg" />
				</span>
			{/if}
			<slot name="primary" />
		</div>

		<div slot="secondary" class="secondary-content">
			<slot name="secondary" />
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
				top: 5px;
				right: 10px;
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
