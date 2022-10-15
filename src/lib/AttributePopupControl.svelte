<script lang="ts">
	import { onMount } from 'svelte';
	import { Popup, type MapGeoJSONFeature, type Map, type MapMouseEvent } from 'maplibre-gl';

	export let map: Map;
	export let targetLayers: string[] = [];
	let popup: Popup | undefined;
	let popupContainer: HTMLDivElement;
	let queriedFeatures: MapGeoJSONFeature[] = [];
	$: onlyOneFeature = queriedFeatures.length === 1;
	let selectedFeature: MapGeoJSONFeature | undefined;

	// eslint-disable-next-line
	function AttributionPopupControl() {}

	AttributionPopupControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		this.button = document.createElement('button');
		this.button.className = 'maplibre-identify-icon';
		this.button.type = 'button';
		this.button.addEventListener('click', () => {
			this.changeButtonCondition();
		});
		this.controlContainer.appendChild(this.button);
		this.button.dispatchEvent(new Event('click'));
		return this.controlContainer;
	};

	AttributionPopupControl.prototype.changeButtonCondition = function () {
		if (this.isActive) {
			this.button.classList.remove('-active');
			this.isActive = false;
			this.map.off('click', this.onClick.bind(this));
			queriedFeatures = [];
			selectedFeature = undefined;
			if (popup) {
				popup.remove();
				popup = undefined;
			}
		} else {
			this.button.classList.add('-active');
			this.isActive = true;
			this.map.on('click', this.onClick.bind(this));
		}
	};

	AttributionPopupControl.prototype.onClick = function (e: MapMouseEvent) {
		if (!this.isActive) {
			queriedFeatures = [];
			selectedFeature = undefined;
			return;
		}
		let layers: string[] = [];
		if (targetLayers.length > 0) {
			targetLayers.forEach((layer: string) => {
				if (this.map.getLayer(layer)) {
					layers.push(layer);
				}
			});
		} else {
			layers = map.getStyle().layers.map((layer) => layer.id);
		}
		const features: MapGeoJSONFeature[] = this.map.queryRenderedFeatures(e.point, { layers });
		queriedFeatures = features;
		selectedFeature = queriedFeatures[0];
		if (queriedFeatures.length > 0) {
			popup = new Popup()
				.setLngLat(e.lngLat)
				.setDOMContent(popupContainer)
				.setMaxWidth('300px')
				.addTo(map);
		} else {
			if (popup) {
				popup.remove();
				popup = undefined;
			}
		}
	};

	AttributionPopupControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	/*global AttributionPopupControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let attributionPopupControl: AttributionPopupControl = null;

	$: {
		if (map) {
			if (attributionPopupControl !== null && map.hasControl(attributionPopupControl) === false) {
				map.addControl(attributionPopupControl, 'top-right');
			}
		}
	}

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		attributionPopupControl = new AttributionPopupControl();
	});
</script>

<div bind:this={popupContainer}>
	{#if queriedFeatures && queriedFeatures.length > 0}
		<div class="select is-fullwidth mb-2 is-success">
			{#if onlyOneFeature}
				<select bind:value={selectedFeature} class="is-focused" disabled>
					{#each queriedFeatures as feature}
						<option value={feature}>{`${feature.sourceLayer} (${feature.source})`}</option>
					{/each}
				</select>
			{:else}
				<select bind:value={selectedFeature} class="is-focused">
					{#each queriedFeatures as feature}
						<option value={feature}>{`${feature.sourceLayer} (${feature.source})`}</option>
					{/each}
				</select>
			{/if}
		</div>
	{/if}
	{#if selectedFeature}
		<div class="popup-table">
			{#if Object.keys(selectedFeature.properties).length > 0}
				<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
					{#each Object.keys(selectedFeature.properties) as key}
						<tr><th>{key}</th><td>{selectedFeature.properties[key]}</td></tr>
					{/each}
				</table>
			{:else}
				<div class="notification is-info is-light">
					No attributes in the selected layer '{selectedFeature.sourceLayer}'
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	/* a style for terrain rgb detector button */
	:global(.maplibre-identify-icon) {
		background: url('data:image/svg+xml;charset=UTF-8,<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256 C512,114.497,397.492,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216 c119.393,0,216,96.615,216,216C472,375.393,375.384,472,256,472z"/></g></g><g><g><path d="M256,214.33c-11.046,0-20,8.954-20,20v128.793c0,11.046,8.954,20,20,20s20-8.955,20-20.001V234.33 C276,223.284,267.046,214.33,256,214.33z"/></g></g><g><g><circle cx="256" cy="162.84" r="27"/></g></g></svg>');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 70%;
	}

	:global(.maplibre-identify-icon.-active) {
		background-color: #ffae00;
	}

	.popup-table {
		max-height: 200px;
		overflow-y: auto;
	}
</style>
