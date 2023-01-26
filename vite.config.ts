import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
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
