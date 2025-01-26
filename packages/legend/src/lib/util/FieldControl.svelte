<script lang="ts">
	import Help from '$lib/util/Help.svelte';
	interface Props {
		title: string;
		help?:
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
			| undefined;
		children?: import('svelte').Snippet;
	}

	let { title = $bindable(), help = $bindable(), children }: Props = $props();
</script>

<div class="field">
	<div class="label">
		{title}
		{#if help}
			<Help type={help.type} layerType={help.layerType} property={help.property} />
		{/if}
	</div>
	<div class="control">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.label {
		display: flex;
	}
</style>
