<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	import LegendSymbol from '@watergis/legend-symbol';
	import type SpriteLoader from './sprite';
	import { getColorFromExpression } from './util/getColorFromExpression';

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	let container: HTMLElement = document.createElement('div');
	$: layer, update();

	const createSvgIcon = (svgXmlString: string) => {
		let blob = new Blob([svgXmlString], { type: 'image/svg+xml' });
		let url = URL.createObjectURL(blob);
		let image = document.createElement('img');
		image.src = url;
		image.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
		image.height = 24;
		image.width = 24;
		return image;
	};

	const update = async () => {
		const zoom = map.getZoom();
		const symbol = LegendSymbol({ zoom: zoom, layer: layer });
		container.innerText = '';

		if (!symbol) {
			if (layer.type === 'hillshade') {
				const svg =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 32c12.5 0 24.1 6.4 30.7 17L503.4 394.4c5.6 8.9 8.6 19.2 8.6 29.7c0 30.9-25 55.9-55.9 55.9H55.9C25 480 0 455 0 424.1c0-10.5 3-20.8 8.6-29.7L225.2 49c6.6-10.6 18.3-17 30.8-17zm65 192L256 120.4 176.9 246.5 208 288l48-64h65z"/></svg>';
				const image = createSvgIcon(svg);
				container.appendChild(image);
			} else if (layer.type === 'fill-extrusion') {
				const svg =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M243.583 91.6027L323.695 138.384C326.575 140.026 326.68 144.583 323.695 146.225L228.503 201.854C225.623 203.55 222.22 203.444 219.549 201.854L124.357 146.225C121.425 144.636 121.373 139.973 124.357 138.384L204.417 91.6027V0L0 119.417V358.252L78.3843 312.477V218.914C78.3319 215.576 82.2066 213.192 85.0865 214.993L180.279 270.622C183.159 272.318 184.782 275.338 184.782 278.464V389.669C184.834 393.007 180.959 395.391 178.079 393.589L97.9673 346.808L19.583 392.583L224 512L428.417 392.583L350.033 346.808L269.921 393.589C267.093 395.338 263.114 393.06 263.218 389.669V278.464C263.218 275.126 265.051 272.159 267.721 270.622L362.914 214.993C365.741 213.245 369.72 215.47 369.616 218.914V312.477L448 358.252V119.417L243.583 0V91.6027Z"/></svg>';
				const image = createSvgIcon(svg);
				container.appendChild(image);
			} else if (layer.type === 'raster') {
				const svg =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zm48 0c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z"/></svg>';
				const image = createSvgIcon(svg);
				container.appendChild(image);
			} else if (layer.type === 'heatmap') {
				const svg =
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-160c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z"/></svg>';
				const image = createSvgIcon(svg);
				container.appendChild(image);
			} else {
				const color = map.getPaintProperty(layer.id, 'background-color');
				const value = getColorFromExpression(color) ?? '#000000';

				const opacity = map.getPaintProperty(layer.id, 'background-opacity') ?? 1;

				const divIcon = document.createElement('div');
				divIcon.style.height = '24px';
				divIcon.style.width = '50px';
				divIcon.style.backgroundColor = value;
				divIcon.style.opacity = `${opacity}`;
				container.appendChild(divIcon);
			}
		} else {
			let divIcon: HTMLElement;
			let svgIcon: SVGSVGElement;
			let dataUrl: string;
			switch (symbol.element) {
				case 'div':
					if (
						symbol.attributes.style.backgroundImage &&
						!['url(undefined)', 'url(null)'].includes(symbol.attributes.style.backgroundImage)
					) {
						var img = document.createElement('img');
						img.src = symbol.attributes.style.backgroundImage.replace('url(', '').replace(')', '');
						img.alt = layer.id;
						img.style.cssText = `height: 24px;`;
						container.appendChild(img);
					}
					divIcon = document.createElement('div');
					divIcon.style.height = '24px';
					divIcon.style.width = '50px';
					divIcon.style.backgroundColor = symbol.attributes.style.backgroundColor;
					divIcon.style.backgroundPosition = symbol.attributes.style.backgroundPosition;
					divIcon.style.backgroundSize = symbol.attributes.style.backgroundSize;
					divIcon.style.backgroundRepeat = symbol.attributes.style.backgroundRepeat;
					divIcon.style.opacity = symbol.attributes.style.opacity;
					container.appendChild(divIcon);
					break;
				case 'svg':
					if (spriteLoader) {
						dataUrl = spriteLoader.getIconDataUrl(layer);
						if (dataUrl) {
							const img = document.createElement('img');
							img.src = dataUrl;
							img.alt = layer.id;
							img.style.cssText = `height: 24px;`;
							container.appendChild(img);
							break;
						}
					}
					svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
					svgIcon.style.cssText = 'height: 24px;';
					svgIcon.setAttributeNS(null, 'version', '1.1');
					Object.keys(symbol.attributes).forEach((k) => {
						svgIcon.setAttribute(k, symbol.attributes[k]);
						let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
						symbol.children.forEach((child: { element: any; attributes: { [x: string]: any } }) => {
							var c = document.createElementNS('http://www.w3.org/2000/svg', child.element);
							Object.keys(child.attributes).forEach((k2) => {
								c.setAttributeNS(null, k2, child.attributes[k2]);
							});
							group.appendChild(c);
						});
						svgIcon.appendChild(group);
					});
					container.appendChild(svgIcon);

					break;
				default:
					console.log(symbol.element);
					return;
			}
		}
	};

	map.on('moveend', update);
	map.on('zoom', update);
</script>

<div class="legend">{@html container.innerHTML}</div>

<style>
	.legend {
		display: inline-flex;
		height: 24px;
	}
</style>
