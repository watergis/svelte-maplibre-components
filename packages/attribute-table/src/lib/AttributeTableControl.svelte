<script lang="ts">
	import { onMount } from 'svelte';
	import type { Map, MapMouseEvent } from 'maplibre-gl';
	import { Split } from '@geoffcox/svelte-splitter/src';
	import AttributeTable from './AttributeTable.svelte';

	export let map: Map;
	export let sourceIds: string[];
	export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';

	export let isTableShown = false;
	export let height = 0;
	export let width = 0;

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

	// eslint-disable-next-line
	function AttributeTableControl() {}

	AttributeTableControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		this.button = document.createElement('button');
		this.button.className = 'maplibre-table-icon';
		this.button.type = 'button';
		this.button.addEventListener('click', () => {
			this.changeButtonCondition();
		});
		this.controlContainer.appendChild(this.button);
		// this.button.dispatchEvent(new Event('click'));
		return this.controlContainer;
	};

	AttributeTableControl.prototype.changeButtonCondition = function () {
		if (this.isActive) {
			this.button.classList.remove('-active');
			this.isActive = false;
			isTableShown = false;
			// this.map.off('click', this.onClick.bind(this));
		} else {
			this.button.classList.add('-active');
			this.isActive = true;
			isTableShown = true;
			// this.map.on('click', this.onClick.bind(this));
		}
	};

	AttributeTableControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		// this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	/*global AttributeTableControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let attributeTableControl: AttributeTableControl = null;

	$: {
		if (map) {
			if (attributeTableControl !== null && map.hasControl(attributeTableControl) === false) {
				map.addControl(attributeTableControl, position);
			}
		}
	}

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		attributeTableControl = new AttributeTableControl();
	});

	const resizeMap = () => {
		if (!map) return;
		map.triggerRepaint();
		map.resize();
	};

	const setSplitControl = () => {
		if (!splitControl) return;
		if (isTableShown === true) {
			if (isMobile) {
				splitControl.setPercent(0);
				splitterSize = '0px';
			} else {
				splitControl.setPercent(50);
				splitterSize = '10px';
			}
		} else {
			splitControl.setPercent(100);
			splitterSize = '0px';
		}
		resizeMap();
	};

	$: isTableShown, opened();
	const opened = () => {
		setSplitControl();
	};

	const splitterChanged = () => {
		resizeMap();
	};
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div class="split-container" style="height:{menuHeight}px;width:{menuWidth}px">
	<Split
		horizontal
		minPrimarySize={isTableShown ? '0%' : '50%'}
		minSecondarySize={isTableShown ? '10%' : '0%'}
		{splitterSize}
		on:changed={splitterChanged}
		bind:this={splitControl}
	>
		<div slot="primary" class="primary-content">
			<slot />
		</div>

		<div slot="secondary" class="secondary-content">
			<AttributeTable bind:map bind:sourceIds />
		</div>
	</Split>
</div>

<style lang="scss">
	/* a style for terrain rgb detector button */
	:global(.maplibre-table-icon) {
		background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"/></svg>');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 70%;
	}

	// :global(.maplibre-table-icon.-active) {
	// 	background-color: #ffae00;
	// }

	.split-container {
		.primary-content {
			position: relative;
			height: 100%;
		}

		.secondary-content {
			position: relative;
			height: 100%;
			overflow: auto;
			padding: 0.5rem;
		}
	}
</style>
