<script lang="ts">
	import Help from '$lib/util/Help.svelte';
	export let title: string;
	export let help:
		| {
				type?: 'paint' | 'layout';
				layerType:
					| 'background'
					| 'fill'
					| 'line'
					| 'symbol'
					| 'raster'
					| 'circle'
					| 'fill-extrusion'
					| 'heatmap'
					| 'hillshade';
				property?: string;
		  }
		| undefined = undefined;
</script>

<div class="field">
	<div class="label">
		{title}
		{#if help}
			<Help bind:type={help.type} bind:layerType={help.layerType} bind:property={help.property} />
		{/if}
	</div>
	<div class="control">
		<slot />
	</div>
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.label {
		display: flex;
	}
</style>
