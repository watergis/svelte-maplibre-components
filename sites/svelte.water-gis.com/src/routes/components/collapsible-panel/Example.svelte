<script lang="ts">
	import { CollapsiblePanel } from '@watergis/svelte-collapsible-panel';
	let isPanelOpen1 = $state(true);
	let isPanelOpen2 = $state(false);
	let isPanelOpen3 = $state(false);
</script>

<div class="panel-container">
	<CollapsiblePanel title="Panel 1" color="is-link" bind:isPanelOpen={isPanelOpen1}>
		<p>Panel content 1</p>
	</CollapsiblePanel>
	<CollapsiblePanel title="Panel 2" color="is-success" bind:isPanelOpen={isPanelOpen2}>
		<p>Panel content 2</p>
	</CollapsiblePanel>
	<CollapsiblePanel title="Panel 3" color="is-warning" bind:isPanelOpen={isPanelOpen3}>
		<p>Panel content 3</p>
	</CollapsiblePanel>
</div>

<style lang="scss">
	.panel-container {
		width: 40%;
	}
</style>
