<script lang="ts">
	import type { ControlPosition, Map } from 'maplibre-gl';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { faTable } from '@fortawesome/free-solid-svg-icons';
	import AttributeTable from './AttributeTable.svelte';

	export let map: Map;
	export let position: ControlPosition = 'top-right';
	export let rowsPerPage = 25;

	let isMenuShown = false;
</script>

<MenuControl
	bind:map
	bind:position
	bind:isMenuShown
	isHorizontal={true}
	sidebarOnLeft={false}
	faIcon={faTable}
	faIconSize="lg"
	minSidebarWidth="40%"
>
	<div slot="sidebar" class="primary-container">
		<AttributeTable bind:map bind:rowsPerPage />
	</div>
	<div slot="map" class="secondary-content">
		<slot />
	</div>
</MenuControl>

<style lang="scss">
	.primary-container {
		padding: 0.6rem;
		width: 100%;
		height: 100%;
	}
</style>
