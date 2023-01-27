<script lang="ts">
	import { PUBLIC_GITHUB_CLIENT_ID as clientId } from '$env/static/public';
	import Button from '$components/Button.svelte';
	import { authStore } from '$lib/stores/authStore';
	import SkeletonLoader from './SkeletonLoader.svelte';
	import { assets } from '../../assets';
	import { getOauthAuthorizeURL } from '../api/github';

	let showLogoutDropdown = false;

	const toggleDropdown = () => {
		showLogoutDropdown = !showLogoutDropdown;
	};
</script>

<div class="navbar-root">
	<h1>
		<a href="/">
			<img src={assets.tinyOctopus} alt="cute octopus" height="36" />
			Repo Explorer
		</a>
	</h1>

	{#if $authStore.isLoggedIn}
		{#await $authStore.user}
			<SkeletonLoader width="144px" height="48px" />
		{:then user}
			<div class="user-details" class:active={showLogoutDropdown}>
				<button on:click={toggleDropdown}>
					<span>{user.login}</span>
					<img src={user.avatar_url} alt={user.login} height="32" />
				</button>

				{#if showLogoutDropdown}
					<div class="logout-dropdown">
						<button on:click={authStore.logout}>Logout</button>
					</div>
				{/if}
			</div>
		{:catch}
			<Button>
				<a href={getOauthAuthorizeURL(clientId)}>Sign in</a>
			</Button>
		{/await}
	{:else}
		<Button>
			<a href={getOauthAuthorizeURL(clientId)}>Sign in</a>
		</Button>
	{/if}
</div>

<style lang="scss">
	.navbar-root {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	h1 {
		text-decoration: underline;

		&:hover {
			text-decoration: none;
		}

		a {
			display: flex;
			align-items: center;
			gap: 0.5em;
		}
	}

	.user-details {
		button {
			display: flex;
			align-items: center;
			gap: 0.5em;
			cursor: pointer;
		}

		img {
			border-radius: 50%;
		}

		&.active > button {
			border: rgba(255, 255, 255, 0.1) 2px solid;
		}
	}

	.logout-dropdown {
		position: absolute;
		right: 2rem;
		padding: 1rem;
		background-color: var(--secondary-color-container);
		border: 2px solid var(--outline-color);
		border-radius: 0.5em;

		:global(button) {
			margin: auto;

			&:hover {
				color: var(--primary-color);
			}
		}
	}
</style>
