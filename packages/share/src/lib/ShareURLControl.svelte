<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import ShareUrlModal from './ShareURLModal.svelte';

	export let map: Map;

	let shareButton: HTMLButtonElement;
	let isShareModalShown = false;

	export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';

	export let customiseUrl = (url: string): string => {
		return url;
	};

	// eslint-disable-next-line
	function ShareUrlControl() {}

	ShareUrlControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		shareButton.addEventListener('click', () => {
			isShareModalShown = !isShareModalShown;
		});
		this.controlContainer.appendChild(shareButton);
		return this.controlContainer;
	};

	ShareUrlControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	/*global ShareUrlControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let shareUrlControl: ShareUrlControl = null;

	$: {
		if (map) {
			if (shareUrlControl !== null && map.hasControl(shareUrlControl) === false) {
				map.addControl(shareUrlControl, position);
			}
		}
	}

	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		shareUrlControl = new ShareUrlControl();
	});
</script>

<button bind:this={shareButton}>
	<i class="fas fa-share-nodes" />
</button>

<ShareUrlModal bind:map bind:isShareModalShown bind:customiseUrl />

<style lang="scss">
	@import 'style/fa/css/all.css';
</style>
