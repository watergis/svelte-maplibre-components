<script lang="ts">
	import { onMount } from 'svelte';
	import { Map } from 'maplibre-gl';
	import { MenuControl } from '$lib';
	import { faBars } from '@fortawesome/free-solid-svg-icons';

	let mapContainer: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
	});

	const onChange = (e) => {
		console.log(e.detail);
	};
</script>

<MenuControl
	bind:map
	position={'top-left'}
	isMenuShown={false}
	sidebarOnLeft={true}
	isHorizontal={false}
	faIcon={faBars}
	faIconSize="nm"
	on:changed={onChange}
>
	<div slot="sidebar">content</div>
	<div slot="map">
		<div class="map" bind:this={mapContainer} />
	</div>
</MenuControl>

<style>
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
