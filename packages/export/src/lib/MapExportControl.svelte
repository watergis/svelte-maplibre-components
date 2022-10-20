<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import MapExport from './MapExport.svelte';

	export let map: Map;

	let showPrintableArea = false;
	let showCrosshair = false;

	let exportContainer: HTMLDivElement;

	// eslint-disable-next-line
	function MapExportControl() {}

	MapExportControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		exportContainer.classList.add('maplibregl-export-list');
		this.button = document.createElement('button');
		this.button.classList.add('maplibre-ctrl-icon');
		this.button.classList.add('maplibregl-export-control');
		this.button.type = 'button';
		this.button.addEventListener('click', () => {
			this.button.style.display = 'none';
			exportContainer.style.display = 'block';
			showPrintableArea = true;
			showCrosshair = true;
		});
		this.onDocumentClick = this.onDocumentClick.bind(this);
		document.addEventListener('click', this.onDocumentClick);
		this.controlContainer.appendChild(this.button);
		this.controlContainer.appendChild(exportContainer);
		return this.controlContainer;
	};

	MapExportControl.prototype.onDocumentClick = function (event: MouseEvent) {
		console.log(event);
		if (
			this.controlContainer &&
			!this.controlContainer.contains(event.target as Element) &&
			this.exportContainer &&
			this.exportButton
		) {
			this.button.style.display = 'block';
			exportContainer.style.display = 'none';
			showPrintableArea = false;
			showCrosshair = false;
		}
	};

	MapExportControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.exportButton.removeEventListener('click', this.onDocumentClick);
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		document.removeEventListener('click', this.onDocumentClick);

		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	/*global MapExportControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let mapExportControl: MapExportControl = null;

	$: {
		if (map) {
			if (mapExportControl !== null && map.hasControl(mapExportControl) === false) {
				map.addControl(mapExportControl, 'top-right');
			}
		}
	}

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		mapExportControl = new MapExportControl();
	});
</script>

<div bind:this={exportContainer}>
	<MapExport bind:map {showPrintableArea} {showCrosshair} />
</div>

<style lang="scss">
	:global(.maplibregl-export-list) {
		display: none;
	}

	:global(.mapboxgl-ctrl-group) {
		.maplibregl-export-list {
			button {
				background: none;
				border: none;
				cursor: pointer;
				display: block;
				font-size: 14px;
				padding: 8px 8px 6px;
				text-align: right;
				width: 100%;
				height: auto;
				text-align: center;
			}
		}
	}

	:global(.maplibregl-export-list) button.active {
		font-weight: bold;
	}

	:global(.maplibregl-export-list) button:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	:global(.maplibregl-export-list) button + button {
		border-top: 1px solid #ddd;
	}

	:global(.maplibre-ctrl-icon) {
		background: url('data:image/svg+xml;charset=UTF-8,<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m422.5 99v-24c0-41.355-33.645-75-75-75h-184c-41.355 0-75 33.645-75 75v24z"/><path d="m118.5 319v122 26 15c0 16.568 13.431 30 30 30h214c16.569 0 30-13.432 30-30v-15-26-122zm177 128h-80c-8.284 0-15-6.716-15-15s6.716-15 15-15h80c8.284 0 15 6.716 15 15s-6.716 15-15 15zm0-64h-80c-8.284 0-15-6.716-15-15s6.716-15 15-15h80c8.284 0 15 6.716 15 15s-6.716 15-15 15z"/><path d="m436.5 129h-361c-41.355 0-75 33.645-75 75v120c0 41.355 33.645 75 75 75h13v-80h-9c-8.284 0-15-6.716-15-15s6.716-15 15-15h24 304 24c8.284 0 15 6.716 15 15s-6.716 15-15 15h-9v80h14c41.355 0 75-33.645 75-75v-120c0-41.355-33.645-75-75-75zm-309 94h-48c-8.284 0-15-6.716-15-15s6.716-15 15-15h48c8.284 0 15 6.716 15 15s-6.716 15-15 15z"/></g></svg>');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 70%;
	}
</style>
