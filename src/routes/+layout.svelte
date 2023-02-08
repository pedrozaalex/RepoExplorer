<script lang="ts">
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';

	import 'iconify-icon';

	import { browser } from '$app/environment';
	import Footer from '$components/Footer.svelte';
	import Navbar from '$components/Navbar.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: Infinity,
				cacheTime: Infinity
			}
		}
	});
</script>

<svelte:head>
	<title>Repo Explorer</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="layout-root">
		<Navbar />

		<main>
			<slot />
		</main>

		<Footer />
	</div>
</QueryClientProvider>

<style lang="scss">
	:global(body) {
		font-family: var(--font-sans);
		color: var(--on-background-color);
		overflow-x: hidden;
	}

	.layout-root {
		background-color: var(--background-color);
		width: 100vw;
		width: 100dvw;
		min-height: 100vh;
		min-height: 100dvh;
		padding: 2em;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	main {
		margin: 4rem 5%;
	}
</style>
