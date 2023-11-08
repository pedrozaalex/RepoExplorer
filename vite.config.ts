import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import wasmPack from 'vite-plugin-wasm-pack';

const config: UserConfig = {
	plugins: [sveltekit(), wasmPack([], ['pyranine'])],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	logLevel: 'info',
	resolve: {
		alias: {
			'node-fetch': 'isomorphic-fetch'
		}
	}
};

export default config;
