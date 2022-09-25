<script lang="ts">
	import type { LayerSpecification, Map } from 'maplibre-gl';
	import LegendSymbol from '@watergis/legend-symbol';
	import SpriteLoader from './sprite';

	export let map: Map;
	export let layer: LayerSpecification;
	export let spriteLoader: SpriteLoader;
	let container: HTMLElement = document.createElement('div');
	$: layer, update();

	const update = async () => {
		// if (!spriteLoaderObject) {
		// 	const styleUrl = $map.getStyle().sprite;
		// 	const loader = new SpriteLoader(styleUrl);
		// 	await loader.load();
		// 	spriteLoaderObject.update(() => loader);
		// }

		const zoom = map.getZoom();
		const symbol = LegendSymbol({ zoom: zoom, layer: layer });
		container.innerText = '';

		if (!symbol) {
			const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const iconPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

			iconSvg.setAttribute('fill', 'none');
			iconSvg.setAttribute('viewBox', '0 0 24 24');
			iconSvg.setAttribute('stroke', 'black');
			iconSvg.classList.add('post-icon');

			iconPath.setAttribute(
				'd',
				'M21,0H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V3A3,3,0,0,0,21,0ZM3,2H21a1,1,0,0,1,1,1V15.86L14.18,9.35a5.06,5.06,0,0,0-6.39-.06L2,13.92V3A1,1,0,0,1,3,2ZM21,22H3a1,1,0,0,1-1-1V16.48l7-5.63a3.06,3.06,0,0,1,3.86,0L22,18.47V21A1,1,0,0,1,21,22Z'
			);

			iconPath.setAttribute('stroke-linecap', 'round');
			iconPath.setAttribute('stroke-linejoin', 'round');
			iconPath.setAttribute('stroke-width', '2');

			iconPath2.setAttribute(
				'd',
				'M18,9a3,3,0,1,0-3-3A3,3,0,0,0,18,9Zm0-4a1,1,0,1,1-1,1A1,1,0,0,1,18,5Z'
			);
			iconPath2.setAttribute('stroke-linecap', 'round');
			iconPath2.setAttribute('stroke-linejoin', 'round');
			iconPath2.setAttribute('stroke-width', '2');

			iconSvg.appendChild(iconPath);
			iconSvg.appendChild(iconPath2);

			container.appendChild(iconSvg);
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
						symbol.children.forEach((child) => {
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
