<script module lang="ts">
	import { SvelteURL } from 'svelte/reactivity';

	export type StyleSwitcherOption = {
		title: string;
		uri: string;
	};

	export class StyleUrl {
		private STYLE_PATHNAME = 'style';

		private getUrl() {
			const location = window.location;
			const url = new SvelteURL(location.href);
			url.hash = location.hash;
			return url;
		}

		private updateUrl(url: SvelteURL) {
			history.replaceState('', '', url.toString());
		}

		public get(): string | null {
			const url = this.getUrl();
			const style = url.searchParams.get(this.STYLE_PATHNAME);
			return style;
		}

		public set(style: string) {
			const url = this.getUrl();
			url.searchParams.set(this.STYLE_PATHNAME, style);
			this.updateUrl(url);
		}

		public delete() {
			const url = this.getUrl();
			url.searchParams.delete(this.STYLE_PATHNAME);
			this.updateUrl(url);
		}

		public getMatchedStyleByTitle(
			styles: StyleSwitcherOption[],
			title: string
		): StyleSwitcherOption | undefined {
			for (const style of styles) {
				if (style.title === title) {
					return style;
				}
			}
			return;
		}

		public getMatchedStyleByUrl(
			styles: StyleSwitcherOption[],
			url: string
		): StyleSwitcherOption | undefined {
			for (const style of styles) {
				if (style.uri === url) {
					return style;
				}
			}
			return;
		}

		public getInitialStyle(styles: StyleSwitcherOption[]) {
			const defaultStyle = styles[0];
			const styleFromUrl = this.get();
			let initialStyle = defaultStyle;
			if (styleFromUrl) {
				const styleObj = this.getMatchedStyleByTitle(styles, styleFromUrl);
				if (styleObj) {
					initialStyle = styleObj;
				}
			} else {
				this.set(initialStyle.title);
			}
			return initialStyle;
		}
	}
</script>

<script lang="ts">
	import type { Map } from 'maplibre-gl';

	interface Props {
		map: Map;
		styles: StyleSwitcherOption[];
		selectedStyle: StyleSwitcherOption;
		onchange?: (selectedStyle: StyleSwitcherOption | undefined) => void;
	}

	let {
		map = $bindable(),
		styles,
		selectedStyle = $bindable(),
		onchange = () => {}
	}: Props = $props();

	let styleUrl = $derived(selectedStyle?.uri ?? '');

	const setStyle = (e) => {
		const newUrl = e.target.value;
		if (!map) return;
		if (styleUrl === newUrl) return;
		map.setStyle(newUrl);
		map.on('styledata', () => {
			const styleUrlObj = new StyleUrl();
			const _style = styleUrlObj.getMatchedStyleByUrl(styles, newUrl);
			if (_style) {
				styleUrlObj.set(_style.title);
				selectedStyle = _style;
			} else {
				styleUrlObj.delete();
			}
			onchange(_style);
		});
	};
</script>

<select class="style-select" value={styleUrl} onchange={setStyle}>
	{#each styles as style (style.title)}
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
