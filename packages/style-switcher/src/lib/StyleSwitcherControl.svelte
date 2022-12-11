<script lang="ts">
	import { onMount } from 'svelte';
	import type { Map } from 'maplibre-gl';
	import type { Position, StyleSwitcherOption } from './types';
	import MapButtons from './MapButtons.svelte';
	import { StyleUrl } from '$lib/style-url';

	export let styles: StyleSwitcherOption[];
	export let map: Map;
	export let position: Position = 'bottom-left';
	export let selectedStyle: StyleSwitcherOption;

	let styleSwitcherDiv: HTMLDivElement;

	// eslint-disable-next-line
	function StyleSwitcherControl() {}

	StyleSwitcherControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl';
		this.controlContainer.appendChild(styleSwitcherDiv);
		return this.controlContainer;
	};

	StyleSwitcherControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map = undefined;
	};

	/*global StyleSwitcherControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let styleSwitcherControl: StyleSwitcherControl = null;

	$: {
		if (map) {
			if (styleSwitcherControl !== null && map.hasControl(styleSwitcherControl) === false) {
				map.addControl(styleSwitcherControl, position);
			}
		}
	}
	onMount(async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		styleSwitcherControl = new StyleSwitcherControl();
	});

	const handleStyleChanged = (e: { detail: { style: StyleSwitcherOption } }) => {
		const style: StyleSwitcherOption = e.detail.style;
		const styleUrlObj = new StyleUrl();
		const _style = styleUrlObj.getMatchedStyleByUrl(styles, style.uri);
		if (_style) {
			styleUrlObj.set(_style.title);
		} else {
			styleUrlObj.delete();
		}
	};
</script>

<div bind:this={styleSwitcherDiv}>
	<MapButtons
		bind:map
		bind:styles
		bind:selectedStyle
		bind:position
		on:change={handleStyleChanged}
	/>
</div>
