<script lang="ts">
	import { Split } from '@geoffcox/svelte-splitter';
	import LayerListPanel from '$lib';
	import { map } from '../stores';
	import type { StyleSpecification } from 'maplibre-gl';

	let style: StyleSpecification;

	$: {
		if ($map) {
			$map.on('load', () => {
				style = $map.getStyle();
			});
		}
	}

	let relativeLayers: { [key: string]: string } = {
		pipeline: 'Pipeline',
		pipeline_annotation: 'Pipeline Label',
		meter: 'Water Meter',
		'flow meter': 'Flow Meter',
		valve: 'Valve',
		firehydrant: 'Fire Hydrant',
		washout: 'Washout',
		tank: 'Tank',
		tank_annotation: 'Tank Label',
		wtp: 'WTP',
		wtp_annotation: 'WTP Label',
		intake: 'Intake',
		intake_annotation: 'Intake Label',
		parcels: 'Parcels',
		parcels_annotation: 'Parcels Label',
		village: 'Village',
		village_annotation: 'Village Label',
		dma: 'DMA',
		'dma-annotation': 'DMA Label',
		'contour-line': 'Countour',
		'contour-label': 'Contour Label',
		hillshade: 'Hillshade',
		sewer_connection: 'Households (Sewer)',
		sewer_commercial: 'Commecial (Sewer)',
		sewer_institution: 'Institution (Sewer)',
		sewer_public_toilet: 'Public Toilet (Sewer)',
		manhole: 'Manhole',
		sewer_pipeline: 'Sewer pipeline',
		sewer_treatment_plant: 'Wastewater treatment plant'
	};

	// relativeLayers = {}
</script>

<Split initialPrimarySize="30%" minPrimarySize={'300px'} splitterSize="0px">
	<div slot="primary" class="drawer-content">
		{#if $map}
			<LayerListPanel bind:map={$map} {style} {relativeLayers} />
		{/if}
	</div>
	<div slot="secondary" class="main-content">
		<slot />
	</div>
</Split>

<style lang="scss">
	$height: calc(100vh);

	.drawer-content {
		overflow: auto;
		display: flex;
		height: $height;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
	}
</style>
