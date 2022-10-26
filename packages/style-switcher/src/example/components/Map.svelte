<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, NavigationControl, AttributionControl } from 'maplibre-gl';
	import { map } from '$example/stores';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import StyleSwitcher, { StyleUrl, type StyleSwitcherOption } from '$lib';

	let isMenuShown = true;
	let mapContainer: HTMLDivElement;

	let styles: StyleSwitcherOption[] = [
		{
			title: 'UNVT Water (OSM)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
		},
		{
			title: 'UNVT Water (Building)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-buildings.json`
		},
		{
			title: 'Satellite Water',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json`
		},
		{
			title: 'UNVT Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-sewer.json`
		},
		{
			title: 'Satellite Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial-sewer.json`
		}
	];
	let selectedStyle: StyleSwitcherOption = styles[0];

	onMount(async () => {
		const styleUrlObj = new StyleUrl();
		const defaultStyle = styles[0];
		const styleFromUrl = styleUrlObj.get();
		let initialStyle = defaultStyle;
		if (styleFromUrl) {
			const styleObj = styleUrlObj.getMatchedStyleByTitle(styles, styleFromUrl);
			if (styleObj) {
				initialStyle = styleObj;
			}
		}
		selectedStyle = initialStyle;

		const map2 = new Map({
			container: mapContainer,
			style: selectedStyle.uri,
			center: { lng: 35.87063, lat: -1.08551 },
			zoom: 13,
			hash: true,
			attributionControl: false
		});
		map2.addControl(
			new NavigationControl({
				visualizePitch: false,
				showZoom: true,
				showCompass: true
			}),
			'top-right'
		);
		map2.addControl(new AttributionControl({ compact: true }), 'bottom-right');

		map.update(() => map2);
	});
</script>

<MenuControl bind:map={$map} position={'top-right'} bind:isMenuShown>
	<div slot="primary">
		<StyleSwitcher bind:map={$map} bind:styles bind:selectedStyle />
	</div>
	<div slot="secondary">
		<div class="map" id="map" bind:this={mapContainer} />
	</div>
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
</style>
