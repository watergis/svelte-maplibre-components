import type { SymbolLayerSpecification } from 'maplibre-gl';

export interface Sprite {
	image: HTMLImageElement;
	json: JSON;
}

export interface spritePosition {
	width: number;
	height: number;
	x: number;
	y: number;
	pixelRatio: number;
	sdf?: boolean;
}

class SpriteLoader {
	private spriteUrl: string;

	private sprite?: Sprite = undefined;

	constructor(url: string) {
		this.spriteUrl = url;
	}

	async load() {
		const res = await Promise.all([
			this.loadImage(`${this.spriteUrl}@2x.png`),
			this.fetchUrl(`${this.spriteUrl}@2x.json`)
		]);
		this.sprite = {
			image: res[0],
			json: res[1]
		};
		return this.sprite;
	}

	loadImage(url: string): Promise<HTMLImageElement> {
		let cancelled = false;
		const promise = new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = () => {
				if (!cancelled) resolve(img);
			};
			img.onerror = (e) => {
				if (!cancelled) reject(e);
			};
			img.src = url;
		});
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		promise.cancel = () => {
			cancelled = true;
		};
		return promise;
	}

	async fetchUrl(url: string) {
		const response = await fetch(url);
		return response.json();
	}

	getIconDataUrl(layer: SymbolLayerSpecification): string {
		let dataUrl = '';
		if (layer.layout && layer.layout['icon-image']) {
			let imgKey = layer.layout['icon-image'];
			if (Array.isArray(imgKey)) {
				imgKey = imgKey[imgKey.length - 1] as string;
			}
			if (this.sprite?.json) {
				let icon: spritePosition | undefined = undefined;
				Object.keys(this.sprite.json).forEach((id) => {
					if (id === imgKey) {
						icon = this.sprite.json[id];
					}
				});
				if (icon) {
					dataUrl = this.extractPartOfImage(this.sprite.image, icon);
				}
			}
		}
		return dataUrl;
	}

	extractPartOfImage(img: CanvasImageSource, sprite: spritePosition) {
		const dpi = 1;
		const el = document.createElement('canvas');
		el.width = sprite.width * dpi;
		el.height = sprite.height * dpi;
		const ctx = el.getContext('2d');
		ctx?.drawImage(
			img,
			sprite.x * dpi,
			sprite.y * dpi,
			sprite.width * dpi,
			sprite.height * dpi,
			0,
			0,
			sprite.width * dpi,
			sprite.height * dpi
		);
		return el.toDataURL();
	}

	isSdf(layer: SymbolLayerSpecification) {
		let isSdf = false;
		if (layer.layout && layer.layout['icon-image']) {
			let imgKey = layer.layout['icon-image'];
			if (Array.isArray(imgKey)) {
				imgKey = imgKey[imgKey.length - 1] as string;
			}
			if (this.sprite?.json) {
				let icon: spritePosition;
				Object.keys(this.sprite.json).forEach((id) => {
					if (id === imgKey) {
						icon = this.sprite.json[id];
					}
				});
				if (icon?.sdf) {
					isSdf = icon?.sdf;
				}
			}
		}
		return isSdf;
	}
}

export default SpriteLoader;
