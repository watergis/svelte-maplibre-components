<script lang="ts">
	import { Popup, type Map, type MapGeoJSONFeature, type MapMouseEvent } from 'maplibre-gl';
	import { onMount } from 'svelte';

	export let map: Map;
	export let targetLayers: string[] = [];
	let popup: Popup | undefined;
	let popupContainer: HTMLDivElement;
	let queriedFeatures: MapGeoJSONFeature[] = [];
	$: onlyOneFeature = queriedFeatures.length === 1;
	let selectedFeature: MapGeoJSONFeature | undefined;

	function AttributionPopupControl() {}

	AttributionPopupControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'maplibregl-ctrl maplibregl-ctrl-group';
		this.button = document.createElement('button');
		this.button.className = 'maplibregl-ctrl-identify maplibre-identify-icon';
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
		queriedFeatures = features.filter((f) => Object.keys(f.properties).length > 0);
		selectedFeature = queriedFeatures.length > 0 ? queriedFeatures[0] : undefined;
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
		<div class="popup-select">
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
			<table>
				{#each Object.keys(selectedFeature.properties) as key}
					<tr><th>{key}</th><td>{selectedFeature.properties[key]}</td></tr>
				{/each}
			</table>
		</div>
	{/if}
</div>

<style lang="scss">
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

	.popup-select {
		margin-bottom: 5px;

		select,
		option {
			width: 100%;
			height: 30px;
			border: rgb(155, 155, 155) 1px inset;
		}

		select {
			width: 100%;
			border-radius: 4px;
			box-sizing: border-box;
			-webkit-appearance: none;
			cursor: pointer;
			background: #fff
				url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2011%2011%22%3E%3Cpath%20d%3D%22M4.33%208.5L0%201L8.66%201z%22%20fill%3D%22%23666%22%2F%3E%3C%2Fsvg%3E')
				right 10px center no-repeat;
			color: #000;
			padding-left: 0.5rem;
			/* Firefox hide arrow */
			-moz-appearance: none;
			text-indent: 0.01px;
			text-overflow: '';
		}
	}

	.popup-table {
		max-height: 200px;
		overflow-y: auto;

		table {
			border-collapse: collapse;
			margin: 0 auto;
		}
		td,
		th {
			border: 1px solid #ccc;
			margin: 10px;
			padding: 2px;
			text-align: left;
			white-space: pre-wrap;
		}
		th {
			background: #efefef;
			width: 30%;
			word-wrap: break-word;
		}
	}
</style>
