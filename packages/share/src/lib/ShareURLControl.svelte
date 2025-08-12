<script lang="ts">
	import type { ControlPosition, Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import ShareUrlModal from './ShareURLModal.svelte';

	let shareButton: HTMLButtonElement | undefined = $state();
	let isShareModalShown = $state(false);

	interface Props {
		map: Map;
		position?: ControlPosition;
		customiseUrl?: (url: string) => string;
	}

	let {
		map = $bindable(),
		position = 'top-right',
		customiseUrl = (url: string): string => {
			return url;
		}
	}: Props = $props();

	function ShareUrlControl() {}

	ShareUrlControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'maplibregl-ctrl maplibregl-ctrl-group';
		if (shareButton) {
			shareButton.className = 'maplibregl-ctrl-share';
			shareButton.addEventListener('click', () => {
				isShareModalShown = !isShareModalShown;
			});
			this.controlContainer.appendChild(shareButton);
		}

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
	let shareUrlControl: ShareUrlControl = $state(null);

	onMount(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		shareUrlControl = new ShareUrlControl();

		if (map) {
			if (shareUrlControl !== null && map.hasControl(shareUrlControl) === false) {
				map.addControl(shareUrlControl, position);
			}
		}
	});
</script>

<button bind:this={shareButton} aria-label="Share map URL">
	<span class="icon is-small">
		<i class="fas fa-share-nodes"></i>
	</span>
</button>

<ShareUrlModal bind:map bind:isShareModalShown {customiseUrl} />
