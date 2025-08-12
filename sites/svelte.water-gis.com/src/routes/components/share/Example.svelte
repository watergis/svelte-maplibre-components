<script lang="ts">
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';
	import { Map, NavigationControl } from 'maplibre-gl';
	import { onMount } from 'svelte';

	let mapContainer: HTMLDivElement | undefined = $state();
	let map: Map | undefined = $state();

	onMount(() => {
		if (!mapContainer) return;
		map = new Map({
			container: mapContainer,
			style: 'https://narwassco.github.io/mapbox-stylefiles/unvt/style.json'
		});
		map.addControl(new NavigationControl({}));
		map.scrollZoom.disable();
		map.touchPitch.enable();
	});

	let customiseUrl = $state((url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('customise', 'true');
		return _url.toString();
	});
</script>

<div class="map" bind:this={mapContainer}></div>
{#if map}
	<ShareURLControl bind:map {customiseUrl} />
{/if}

<style lang="scss">
	@import 'maplibre-gl/dist/maplibre-gl.css';

	$height: calc(60vh);

	.map {
		display: inline-block;
		text-align: left;
		width: 100%;
		height: $height;
		z-index: 1;
	}
</style>
