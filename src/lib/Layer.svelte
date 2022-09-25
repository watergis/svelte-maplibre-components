<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import Legend from './Legend.svelte';
	import Fa from 'svelte-fa';
	import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
	import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
	import type SpriteLoader from './sprite';
	const dispatch = createEventDispatcher();

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	export let relativeLayers: { [key: string]: string } = {};
	let visibility = layer.layout && layer.layout.visibility ? layer.layout.visibility : undefined;

	let checked = visibility === 'none' ? false : true;
	$: checked, setVisibility();

	const setVisibility = () => {
		map.setLayoutProperty(layer.id, 'visibility', checked === true ? 'visible' : 'none');
		dispatch('visibilityChanged', {
			layer
		});
	};
</script>

<div class="columns is-vcentered is-mobile">
	<div class="column .is-marginless is-paddingless">
		<button class="button is-text is-narrow" on:click={() => (checked = !checked)}>
			{#if checked}
				<Fa icon={faEye} scale={1} />
			{:else}
				<Fa icon={faEyeSlash} scale={1} />
			{/if}
		</button>
	</div>
	<div class="column is-narrow .is-marginless is-paddingless">
		<Legend {map} {layer} {spriteLoader} />
	</div>
	<div class="column is-narrow .is-marginless pl-2 has-text-left">
		{relativeLayers && relativeLayers[layer.id] ? relativeLayers[layer.id] : layer.id}
	</div>
</div>
