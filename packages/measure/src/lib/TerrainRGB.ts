import { WebpMachine, loadBinaryData } from 'webp-hero';
import PNG from 'png-ts';
import { lngLatToGoogle } from 'global-mercator';

/**
 * Abstract class for terrain RGB tiles
 */
class TerrainRGB {
	protected url: string;

	protected tileSize: number;

	protected minzoom: number;

	protected maxzoom: number;

	/**
	 * Constructor
	 * @param url URL for terrain RGB raster tilesets
	 * @param tileSize size of tile. 256 or 512
	 * @param minzoom minzoom for terrain RGB raster tilesets. default is 5
	 * @param maxzoom maxzoom for terrain RGB raster tilesets. default is 15
	 */
	constructor(url: string, tileSize: number, minzoom = 5, maxzoom = 15) {
		this.url = url;
		this.tileSize = tileSize;
		this.minzoom = minzoom;
		this.maxzoom = maxzoom;
	}

	/**
	 * Get the value from target coordinates and zoom level by using certain formula.
	 * @param lnglat coordinates
	 * @param z  zoom level
	 * @returns the value calculated by certain formula
	 */
	private getValue(lnglat: number[], z: number): Promise<number> {
		// eslint-disable-next-line no-unused-vars
		return new Promise((resolve: (value: number) => void, reject: (reason?: any) => void) => {
			const lng = lnglat[0];
			const lat = lnglat[1];
			let zoom = z;
			if (z > this.maxzoom) {
				zoom = this.maxzoom;
			} else if (z < this.minzoom) {
				zoom = this.minzoom;
			}
			const result = lngLatToGoogle([lng, lat], zoom);
			const tile = [result[0], result[1], result[2]];
			const url: string = this.url
				.replace(/{x}/g, tile[0].toString())
				.replace(/{y}/g, tile[1].toString())
				.replace(/{z}/g, tile[2].toString());
			let ext = this.getUrlExtension(url);
			// console.log(ext)
			if (!ext) {
				ext = 'png';
			}
			switch (ext) {
				case 'png':
					this.getBinaryfromUrl(url)
						.then((binary: Uint8Array) => {
							const value = this.getValueFromPNG(binary, tile, lng, lat);
							resolve(value);
						})
						.catch(reject);
					//   axios.get(url, {
					//     responseType: 'arraybuffer',
					//   })
					//     .then((res) => {
					//       const binary = Buffer.from(res.data, 'binary');
					//       const value = this.getValueFromPNG(binary, tile, lng, lat);
					//       resolve(value);
					//     })
					//     .catch((err) => reject(err));
					break;
				case 'webp':
					loadBinaryData(url)
						.then((binary) => {
							this.getValueFromWEBP(binary, tile, lng, lat)
								.then((value: number) => {
									resolve(value);
								})
								.catch(reject);
						})
						.catch(reject);
					break;
				default:
					reject(new Error(`Invalid file extension: ${ext}`));
					break;
			}
		});
	}

	async getBinaryfromUrl(url: string) {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return new Uint8Array(arrayBuffer);
	}

	/**
	 * Get the value calculated from coordinates on PNG raster tileset
	 * @param binary Image binary data
	 * @param tile tile index info
	 * @param lng longitude
	 * @param lat latitude
	 * @returns the value calculated from coordinates
	 */
	private getValueFromPNG(binary: Uint8Array, tile: number[], lng: number, lat: number): number {
		const pngImage = PNG.load(binary);
		const pixels = pngImage.decodePixels();
		const rgba = this.pixels2rgba(pixels, tile, lng, lat);
		// console.log(rgba)
		const height = this.calc(rgba[0], rgba[1], rgba[2]);
		return height;
	}

	/**
	 * Get the value calculated from coordinates on WEBP raster tileset
	 * @param binary Image binary data
	 * @param tile tile index info
	 * @param lng longitude
	 * @param lat latitude
	 * @returns the value calculated from coordinates
	 */
	private getValueFromWEBP(
		binary: Uint8Array,
		tile: number[],
		lng: number,
		lat: number
	): Promise<number> {
		// eslint-disable-next-line no-unused-vars
		return new Promise((resolve: (value: number) => void, reject: (reason?: any) => void) => {
			const webpMachine = new WebpMachine();
			webpMachine
				.decode(binary)
				.then((dataURI: string) => {
					const buffer = this.dataURIConverter(dataURI);
					const height = this.getValueFromPNG(buffer, tile, lng, lat);
					resolve(height);
				})
				.catch((err) => reject(err));
		});
	}

	/**
	 * Get an altitude calculated from terrain RGB information
	 * @param lnglat coordinates
	 * @param z zoom level
	 * @returns an altitude calculated from terrain RGB information
	 */
	public async getElevation(lnglat: number[], z: number): Promise<number> {
		const height = await this.getValue(lnglat, z);
		return height;
	}

	/**
	 * Formula for calculating an elevation from RGB
	 * @param r red
	 * @param g green
	 * @param b blue
	 * @returns an elevation calculated
	 */
	private calc(r: number, g: number, b: number): number {
		const elev = -10000 + (r * 256 * 256 + g * 256 + b) * 0.1;
		return elev;
	}

	/**
	 * Get RGBA values from coordinates information
	 * @param pixels pixels info
	 * @param tile tile index info
	 * @param lng longitude
	 * @param lat latitude
	 * @returns RGBA values
	 */
	private pixels2rgba(pixels: Uint8Array, tile: number[], lng: number, lat: number): number[] {
		const data = [];
		for (let i = 0; i < pixels.length; i += 4) {
			const r = pixels[i];
			const g = pixels[i + 1];
			const b = pixels[i + 2];
			const a = pixels[i + 3];
			const rgba = [r, g, b, a];
			data.push(rgba);
		}
		const bbox = this.tileToBBOX(tile);
		const pixPos = this.getPixelPosition(lng, lat, bbox);
		const pos = pixPos[0] + pixPos[1] * this.tileSize;
		const rgba = data[pos];
		return rgba;
	}

	/**
	 * Get the position in pixel from the coordinates
	 * @param lng longitude
	 * @param lat latitude
	 * @param bbox bbox (minx, miny, maxx, maxy)
	 * @returns The position in pixel
	 */
	private getPixelPosition(lng: number, lat: number, bbox: number[]): number[] {
		const pixelWidth = this.tileSize;
		const pixelHeight = this.tileSize;
		const bboxWidth = bbox[2] - bbox[0];
		const bboxHeight = bbox[3] - bbox[1];

		const widthPct = (lng - bbox[0]) / bboxWidth;
		const heightPct = (lat - bbox[1]) / bboxHeight;
		const xPx = Math.floor(pixelWidth * widthPct);
		const yPx = Math.floor(pixelHeight * (1 - heightPct));
		return [xPx, yPx];
	}

	/**
	 * Get file extenstion name from the URL
	 * @param url URL for tilesets
	 * @returns file extenstion either png or webp
	 */
	private getUrlExtension(url: string): string | undefined {
		let extension = url.split(/[#?]/)[0].split('.').pop();
		if (extension) {
			extension = extension.trim();
		}
		return extension;
	}

	/**
	 * Get buffer data from Image URI
	 * @param dataURI Image URI
	 * @returns buffer from the image
	 */
	private dataURIConverter(dataURI: string): Uint8Array {
		const byteString = atob(dataURI.split(',')[1]);
		const buffer = new Uint8Array(byteString.length);
		for (let i = 0; i < byteString.length; i += 1) {
			buffer[i] = byteString.charCodeAt(i);
		}
		return buffer;
	}

	/**
	 * Get the bbox of a tile
	 *
	 * @name tileToBBOX
	 * @param {Array<number>} tile
	 * @returns {Array<number>} bbox
	 * @example
	 * var bbox = tileToBBOX([5, 10, 10])
	 * //=bbox
	 */
	private tileToBBOX(tile: number[]): number[] {
		const e = this.tile2lon(tile[0] + 1, tile[2]);
		const w = this.tile2lon(tile[0], tile[2]);
		const s = this.tile2lat(tile[1] + 1, tile[2]);
		const n = this.tile2lat(tile[1], tile[2]);
		return [w, s, e, n];
	}

	private tile2lon(x: number, z: number): number {
		// eslint-disable-next-line no-restricted-properties, no-mixed-operators
		return (x / Math.pow(2, z)) * 360 - 180;
	}

	private tile2lat(y: number, z: number): number {
		const r2d = 180 / Math.PI;
		// eslint-disable-next-line no-restricted-properties, no-mixed-operators
		const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
		return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
	}
}

export default TerrainRGB;
