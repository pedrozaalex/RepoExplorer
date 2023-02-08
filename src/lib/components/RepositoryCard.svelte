<script lang="ts" context="module">
	export type StandardRepo = {
		description: string;
		forks: number;
		issues: number;
		license: string;
		name: string;
		owner: string;
		stars: number;
		updatedAt: string;
		url: string;
		website: string | null;
	};
</script>

<script lang="ts">
	import { calculateLastUpdatedFromISO } from '$lib/utils';
	import autoAnimate from '@formkit/auto-animate';
	import { fade } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import RepoLanguages from './RepoLangs.svelte';
	import Stats from './Stats.svelte';

	export let data: StandardRepo;
	$: ({ description, forks, issues, license, name, owner, stars, updatedAt, url, website } = data);
	$: lastUpdate = calculateLastUpdatedFromISO(updatedAt);

	let showActions = false;
	const hideActions = () => (showActions = false);
	const displayActions = () => (showActions = true);
</script>

<div class="repo" on:mouseenter={displayActions} on:mouseleave={hideActions}>
	<div class="repo-main">
		<h2 class="repo-title">
			<a href={`https://github.com/${owner}`} class="repo-owner">{owner}</a>
			<span class="slash">/</span>
			<a href={`/repo/${owner}/${name}`} class="repo-name">{name}</a>
		</h2>

		<p class="repo-description" title={description}>{description}</p>

		<div use:autoAnimate>
			<RepoLanguages {owner} {name} />

			<div class="repo-stats">
				<aside>
					<p>
						License:<br />
						<span title={license}>{license}</span>
					</p>

					<p>
						Last update:<br />
						<span title={updatedAt}>{lastUpdate}</span>
					</p>
				</aside>

				<Stats {stars} {forks} {issues} />
			</div>
		</div>
	</div>

	{#if showActions}
		<ul class="actions" class:show={showActions} transition:fade={{ duration: 100 }}>
			<li class="action">
				<a href={url} target="_blank" rel="noreferrer">
					<iconify-icon icon="mdi:github" height="20" />
				</a>
			</li>

			{#if website && typeof website === 'string'}
				<li class="action">
					<a href={website} target="_blank" rel="noreferrer" class:disabled={!website}>
						<iconify-icon icon="mdi:web" height="20" />
					</a>
				</li>
			{/if}

			<li class="action">
				<a href={`/repo/${owner}/${name}`}>
					<iconify-icon icon="mdi:arrow-expand" height="20" />
				</a>
			</li>
		</ul>
	{/if}
</div>

<style lang="scss">
	@import '../mixins.scss';

	.repo {
		background-color: white;
		box-shadow: var(--shadow);
		border: var(--primary-border);
		border-radius: 1rem;
		color: black;
		position: relative;
	}

	.repo-main {
		padding: 1rem;
	}

	.repo-title {
		font-family: var(--font-sans);
		display: flex;
		margin-bottom: 1rem;
		align-items: baseline;
		justify-content: center;
		gap: 0.25rem;

		& > * {
			@include ellipsis;
		}

		a {
			text-decoration: underline;

			&:hover {
				text-decoration: none;
			}
		}

		.slash {
			color: var(--darker-gray);
		}
	}

	.repo-description {
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
		line-height: 1.2em;
		font-family: var(--font-sans);
		text-align: justify;
	}

	.repo-stats {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 0.5rem;
		font-size: 0.8rem;
		margin-top: 1rem;

		aside {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: flex-start;
			height: 100%;
			gap: 1rem;
			max-width: 60%;

			p {
				@include lines(2);
			}
		}
	}

	.actions {
		position: absolute;
		right: 0.25rem;
		top: 0.25rem;

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		background-color: var(--primary-color);
		border-radius: 0.8rem;
		padding: 0.3rem;

		transform: scale(1);
		transition: transform 0.1s ease-in-out;

		&:hover {
			transform: scale(1.2);
		}

		a {
			display: flex;
		}
	}
</style>
