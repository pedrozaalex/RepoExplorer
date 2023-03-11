import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import wasmPack from 'vite-plugin-wasm-pack';
import polyfillNode from 'vite-plugin-node-stdlib-browser';

const config: UserConfig = {
	plugins: [sveltekit(), wasmPack([], ['pyranine']), polyfillNode()],
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
