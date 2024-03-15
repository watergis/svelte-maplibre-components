<script lang="ts">
	import Fa from 'svelte-fa';
	import { faArrowDownUpAcrossLine, faArrowDownUpLock } from '@fortawesome/free-solid-svg-icons';

	export let onlyRendered = true;
	export let onlyRelative = true;
	export let enableLayerOrder = false;
	export let isLayerOrderShown = false;

	let layerOrderTabWidth = 0;
</script>

<div class="tabs">
	<input
		id="rendered"
		type="checkbox"
		name="rendered_tab"
		checked={onlyRendered}
		on:click={() => (onlyRendered = !onlyRendered)}
	/>
	<label
		class="tab_item"
		for="rendered"
		style="width:calc((100% - {layerOrderTabWidth}px - 10px)/2)">Show rendered</label
	>
	<input
		id="relative"
		type="checkbox"
		name="relative_tab"
		checked={onlyRelative}
		on:click={() => (onlyRelative = !onlyRelative)}
	/>
	<label
		class="tab_item"
		for="relative"
		style="width:calc((100% - {layerOrderTabWidth}px - 10px)/2)">Show related</label
	>
	{#if isLayerOrderShown}
		<div
			class="has-tooltip-bottom"
			data-tooltip="{enableLayerOrder ? 'Disable' : 'Enable'} changing layer ordering"
		>
			<input
				id="layerorder"
				type="checkbox"
				name="relative_tab"
				checked={enableLayerOrder}
				on:click={() => (enableLayerOrder = !enableLayerOrder)}
			/>
			<label
				class="tab_item layer-order-tab"
				for="layerorder"
				bind:clientWidth={layerOrderTabWidth}
			>
				{#if enableLayerOrder}
					<Fa icon={faArrowDownUpAcrossLine} />
				{:else}
					<Fa icon={faArrowDownUpLock} />
				{/if}
			</label>
		</div>
	{/if}
</div>

<style lang="scss">
	@use '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css';

	.tabs {
		margin-top: 0.5rem;
		padding-bottom: 0.5rem;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		width: 100%;
		margin: 0 auto;

		.tab_item {
			cursor: pointer;
			background-color: #f5f5f5;
			border-color: #787878;
			line-height: 2.5rem;
			text-align: center;
			color: #565656;
			display: block;
			float: left;
			text-align: center;
			font-weight: bold;
			transition: all 0.2s ease;
			font-family:
				system-ui,
				-apple-system,
				system-ui,
				'Helvetica Neue',
				Helvetica,
				Arial,
				sans-serif;
			font-size: 15px;
			font-weight: 600;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-left: 0.1rem;
			margin-right: 0.1rem;
		}
		.tab_item:hover {
			opacity: 0.75;
		}

		input {
			display: none;
		}

		.layer-order-tab {
			width: 40px;
		}
	}

	.tabs input:checked + .tab_item {
		background-color: #485fc7;
		border-color: #485fc7;
		color: #fff;
	}
</style>
