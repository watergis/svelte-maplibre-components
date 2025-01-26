<script lang="ts">
	import type { Option } from '$lib/interfaces';
	interface Props {
		options: Option[];
		selectedValue: string | string[] | number | number[];
		onchange?: (value: string | string[] | number | number[]) => void;
	}

	let { options = $bindable(), selectedValue = $bindable(), onchange = () => {} }: Props = $props();
</script>

<div class="field has-addons">
	{#key selectedValue}
		{#each options as option}
			<div class="control">
				<button
					class="button is-small {`${
						JSON.stringify(option.value) == JSON.stringify(selectedValue)
							? 'is-info is-light is-active'
							: ''
					}`}"
					onclick={() => {
						selectedValue = JSON.parse(JSON.stringify(option.value));
						if (onchange) onchange(selectedValue);
					}}
					aria-label={option.title}
				>
					<span>{option.title}</span>
				</button>
			</div>
		{/each}
	{/key}
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';
</style>
