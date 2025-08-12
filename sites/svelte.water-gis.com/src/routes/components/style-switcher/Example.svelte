<script lang="ts">
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import {
		StyleSwitcher,
		StyleUrl,
		type StyleSwitcherOption
	} from '@watergis/svelte-maplibre-style-switcher';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let isMenuShown = $state(true);

	let mapContainer: HTMLDivElement | undefined = $state();
	let map: Map | undefined = $state();
	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let menuHeight = $derived(innerHeight * 0.6);
	let menuWidth = $derived(innerWidth * 0.95);

	let styles: StyleSwitcherOption[] = $state([
		{
			title: 'UNVT Water (OSM)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
		},
		{
			title: 'Satellite Water',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json`
		}
	]);
	let selectedStyle: StyleSwitcherOption | undefined = $state();

	onMount(() => {
		if (!mapContainer) return;
		const styleUrlObj = new StyleUrl();
		selectedStyle = styleUrlObj.getInitialStyle(styles);

		map = new Map({
			container: mapContainer,
			style: selectedStyle.uri
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<MenuControl bind:map position="top-right" bind:isMenuShown width={menuWidth} height={menuHeight}>
	{#snippet sidebar()}
		<div class="primary-container">
			<h4>Style switch control</h4>
			<StyleSwitcher bind:map {styles} bind:selectedStyle />
		</div>
	{/snippet}
	{#snippet mapControl()}
		<div>
			<div class="map" bind:this={mapContainer}></div>
		</div>
	{/snippet}
</MenuControl>

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.primary-container {
		margin: 0.5rem;
	}
</style>
