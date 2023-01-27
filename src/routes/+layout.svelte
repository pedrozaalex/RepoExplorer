<script lang="ts">
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';
	import Footer from '$components/Footer.svelte';
	import Navbar from '$components/Navbar.svelte';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
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
		font-family: 'Inter', sans-serif;
		color: var(--on-background-color);
	}

	.layout-root {
		background-color: var(--background-color);
		width: 100vw;
		min-height: 100vh;
		padding: 2em;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	main {
		margin-top: 4rem;
		margin-bottom: 4rem;
	}
</style>
