<script lang="ts">
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="layout-root">
	<Navbar />

	<slot />

	<Footer />
</div>

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
</style>
