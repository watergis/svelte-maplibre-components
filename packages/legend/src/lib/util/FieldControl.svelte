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
	<label class="label is-normal">
		{title}
		{#if help}
			<Help bind:type={help.type} bind:layerType={help.layerType} bind:property={help.property} />
		{/if}
	</label>
	<div class="control">
		<slot />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';

	.label {
		display: flex;
	}
</style>
