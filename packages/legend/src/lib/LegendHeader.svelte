<script lang="ts">
	export let onlyRendered = true;
	export let onlyRelative = true;
	export let relativeLayers: { [key: string]: string } = {};
</script>

<div class="tabs is-toggle is-fullwidth m-2r">
	<ul>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<li class={onlyRendered ? 'is-active' : ''} on:click={() => (onlyRendered = !onlyRendered)}>
			<!-- svelte-ignore a11y-missing-attribute -->
			<a>
				<span>Show rendered</span>
			</a>
		</li>
		{#if relativeLayers && Object.keys(relativeLayers).length > 0}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li class={onlyRelative ? 'is-active' : ''} on:click={() => (onlyRelative = !onlyRelative)}>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a>
					<span>Show related</span>
				</a>
			</li>
		{/if}
	</ul>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
