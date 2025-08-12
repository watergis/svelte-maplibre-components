<script lang="ts">
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import type { ControlPosition, Map } from 'maplibre-gl';
	import AttributeTable from './AttributeTable.svelte';

	interface Props {
		map: Map;
		position?: ControlPosition;
		rowsPerPage?: number;
		minZoom?: number;
		width?: number;
		height?: number;
		children?: import('svelte').Snippet;
	}

	let {
		map = $bindable(),
		position = $bindable('top-right'),
		rowsPerPage = $bindable(50),
		minZoom = $bindable(14),
		width = $bindable(0),
		height = $bindable(0),
		children
	}: Props = $props();

	let attributeTable: AttributeTable | undefined = $state(undefined);
	let showAttributeTable = $state(false);

	$effect(() => {
		if (showAttributeTable) {
			attributeTable?.getLayerList();
		}
	});
</script>

<MenuControl
	bind:map
	{position}
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
	{#snippet sidebar()}
		<div class="primary-container">
			<AttributeTable bind:map bind:rowsPerPage bind:minZoom bind:this={attributeTable} />
		</div>
	{/snippet}
	{#snippet mapControl()}
		<div class="secondary-container">
			{@render children?.()}
		</div>
	{/snippet}
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
