<script lang="ts">
	import Button from '$components/Button.svelte';
	import { VERCEL_GITHUB_CLIENT_ID as clientId } from '$env/static/public';
	import { authStore } from '$lib/stores/authStore';
	import { getOauthAuthorizeURL } from '$lib/api/github';
	import bigOctopus from '$images/big-octopus.png';
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

		<img src={bigOctopus} alt="cute octopus" height="300" />
	</div>

	{#if $authStore.isLoggedIn}
		<a href="/search">
			<Button>Start Exploring</Button>
		</a>
	{:else}
		<a href={getOauthAuthorizeURL(clientId)}>
			<Button --background="black" --color="white">
				<iconify-icon slot="leftIcon" icon="mdi:github" style="color: white" height="24" />
				Continue with GitHub
				<iconify-icon
					slot="rightIcon"
					icon="material-symbols:arrow-forward-rounded"
					style="color: white"
					height="24" />
			</Button>
		</a>
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

		@media screen and (max-width: 720px) {
			flex-direction: column-reverse;
			gap: 1rem;
			text-align: center;
		}
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

		@media screen and (max-width: 720px) {
			margin: auto;
		}
	}
</style>
