import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x'
		}),
		alias: {
			$images: './src/lib/assets/images',
			$components: './src/lib/components'
		},
		env: {
			// This is needed so we can access VERCEL_URL in the build stage
			publicPrefix: 'VERCEL_'
		}
	}
};

export default config;
