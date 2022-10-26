import type { StyleSwitcherOption } from './types';

export class StyleUrl {
	private STYLE_PATHNAME = 'style';

	private getUrl() {
		const location = window.location;
		const url = new URL(location.href);
		url.hash = location.hash;
		return url;
	}

	private updateUrl(url: URL) {
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
