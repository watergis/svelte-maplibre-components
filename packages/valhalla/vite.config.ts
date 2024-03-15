import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { resolve } from 'path';

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
	ssr: {
		noExternal: ['maplibre-gl']
	}
};

export default config;
