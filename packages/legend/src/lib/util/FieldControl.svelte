<script lang="ts">
	export let title: string;
</script>

<div class="field">
	<label class="label is-normal">{title}</label>
	<div class="control">
		<slot />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
