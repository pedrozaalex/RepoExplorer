<script lang="ts">
	import { assets } from '../assets';
	import Button from '$lib/components/Button.svelte';
	import { PUBLIC_GITHUB_CLIENT_ID as clientId } from '$env/static/public';
	import { github } from '$lib/github';
	import { authStore } from '../lib/stores/authStore';
</script>

<div class="homepage-root">
	<div class="hero">
		<aside>
			<h1 class="hero-title">
				<span>Welcome to</span>
				Repo Explorer
			</h1>

			<p class="hero-subtitle">
				Save time when looking for the best libraries to use in your next project!
			</p>
		</aside>

		<img src={assets.bigOctopus} alt="cute octopus" height="300" />
	</div>

	{#if $authStore.isLoggedIn}
		<Button>
			<a href="/search">Start Exploring</a>
		</Button>
	{:else}
		<Button leftIcon={'github'} rightIcon={'continue'} --background="black" --color="white">
			<a href={github.getOauthURL(clientId)}> Continue with GitHub </a>
		</Button>
	{/if}
</div>

<style lang="scss">
	.homepage-root {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hero {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 50rem;
		font-size: 3rem;
		margin: auto;
		margin-bottom: 2rem;
		gap: 2rem;
	}

	.hero-title {
		font-weight: 700;
		line-height: 0.8;
		color: var(--primary-color);
		margin-bottom: 1rem;
	}

	.hero-title > span {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.75em;
		color: var(--secondary-color);
	}

	.hero-subtitle {
		line-height: 1.2;
		color: var(--on-background-color);
		max-width: 25rem;
		font-size: 0.4em;
	}
</style>
