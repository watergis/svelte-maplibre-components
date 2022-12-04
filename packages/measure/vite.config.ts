import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { resolve } from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$example: resolve('./src/example')
		}
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true
				})
			]
		}
	}
};

export default config;
