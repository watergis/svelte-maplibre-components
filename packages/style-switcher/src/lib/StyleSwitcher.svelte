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

<div class="container">
	<div class="style-container">
		<select class="style-select" bind:value={styleUrl}>
			{#each styles as style}
				<option value={style.uri}>{style.title}</option>
			{/each}
		</select>
	</div>
</div>

<style lang="scss">
	.container {
		position: relative;

		.style-container::before {
			border-bottom: 7px solid #485fc7;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			content: '';
			position: absolute;
			right: 9px;
			top: 12px;
			width: 0;
		}
		.style-container::after {
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-top: 7px solid #485fc7;
			content: '';
			position: absolute;
			right: 9px;
			top: 23px;
			width: 0;
		}

		.style-select {
			cursor: pointer;
			width: 100%;
			height: 40px;
			border-color: #485fc7;
			font-size: 1em;
			padding: 10px;
		}

		select {
			-webkit-appearance: none;
			appearance: none; /* デフォルトの矢印を非表示 */
		}
		select::-ms-expand {
			display: none; /* デフォルトの矢印を非表示(IE用) */
		}
	}
</style>
