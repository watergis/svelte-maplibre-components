<script lang="ts">
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import type { ControlPosition, Map } from 'maplibre-gl';
	import AttributeTable from './AttributeTable.svelte';

	export let map: Map;
	export let position: ControlPosition = 'top-right';
	export let rowsPerPage = 50;
	export let minZoom = 14;
	export let width = 0;
	export let height = 0;

	let showAttributeTable = false;

	$: if (showAttributeTable) {
		getLayerList();
	}

	let getLayerList: () => void;
</script>

<MenuControl
	bind:map
	bind:position
	bind:isMenuShown={showAttributeTable}
	isHorizontal={true}
	sidebarOnLeft={false}
	faIcon="fa-solid fa-table"
	faIconSize="lg"
	minSidebarWidth="40%"
	controlName="attribute-table"
	bind:width
	bind:height
>
	<div slot="sidebar" class="primary-container">
		<AttributeTable bind:map bind:rowsPerPage bind:minZoom bind:getLayerList />
	</div>
	<div slot="map" class="secondary-container">
		<slot />
	</div>
</MenuControl>

<style lang="scss">
	.primary-container {
		padding: 0.6rem;
		width: 100%;
		height: 100%;
	}

	.secondary-container {
		width: 100%;
		height: 100%;
	}
</style>
