<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { StyleUrl } from '$lib/style-url';
	import type { Map } from 'maplibre-gl';
	import type { StyleSwitcherOption } from './types';

	export let map: Map;
	export let styles: StyleSwitcherOption[];
	export let selectedStyle: StyleSwitcherOption;

	const dispatch = createEventDispatcher();
	let styleUrl = selectedStyle.uri;
	$: styleUrl, setStyle();
	$: selectedStyle, updateStyleSelect();

	const setStyle = () => {
		if (!map) return;
		if (styleUrl === selectedStyle.uri) return;
		map.setStyle(styleUrl);
		map.on('styledata', () => {
			const styleUrlObj = new StyleUrl();
			const _style = styleUrlObj.getMatchedStyleByUrl(styles, styleUrl);
			if (_style) {
				styleUrlObj.set(_style.title);
				selectedStyle = _style;
			} else {
				styleUrlObj.delete();
			}
			dispatch('change');
		});
	};

	const updateStyleSelect = () => {
		if (styleUrl === selectedStyle.uri) return;
		styleUrl = selectedStyle.uri;
	};
</script>

<select class="style-select" bind:value={styleUrl}>
	{#each styles as style}
		<option value={style.uri}>{style.title}</option>
	{/each}
</select>

<style lang="scss">
	.style-select {
		cursor: pointer;
		width: 100%;
		height: 40px;
		border-radius: 4px;
		border-color: #485fc7;
		box-sizing: border-box;
		font-size: 1em;
		padding: 10px;
	}

	select {
		width: 100%;
		border-radius: 4px;
		border-color: #485fc7;
		box-sizing: border-box;
		background: transparent;
		-webkit-appearance: none;
		cursor: pointer;
		background: #fff
			url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2011%2011%22%3E%3Cpath%20d%3D%22M4.33%208.5L0%201L8.66%201z%22%20fill%3D%22%23666%22%2F%3E%3C%2Fsvg%3E')
			right 10px center no-repeat;
		padding: 12px 35px 12px 11px;
		color: #000;

		/* Firefox hide arrow */
		-moz-appearance: none;
		text-indent: 0.01px;
		text-overflow: '';
	}
	/* IE10 hide arrow */
	select::-ms-expand {
		display: none;
	}
</style>
