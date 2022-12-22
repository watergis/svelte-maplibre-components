<script lang="ts">
	import type { Option } from '$lib/interfaces';
	export let options: Option[];
	export let selectedValue: string | string[] | number | number[];
</script>

<p class="buttons">
	{#key selectedValue}
		{#each options as option}
			<p class="control pt-2">
				<button
					class="button is-small {`${
						JSON.stringify(option.value) == JSON.stringify(selectedValue)
							? 'is-info is-light is-active'
							: ''
					}`}"
					on:click={() => {
						selectedValue = JSON.parse(JSON.stringify(option.value));
					}}
				>
					<span>{option.title}</span>
				</button>
			</p>
		{/each}
	{/key}
</p>

<style lang="scss">
	@import 'bulma/bulma.sass';
</style>
