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
	import { calculateLastUpdated } from '$lib/utils';

	import autoAnimate from '@formkit/auto-animate';
	import Icon from './Icon.svelte';
	import RepoLanguages from './RepoLanguages.svelte';
	import Stats from './Stats.svelte';

	export let data: StandardRepo;

	$: ({ description, forks, issues, license, name, owner, stars, updatedAt, url, website } = data);

	let showActions = true;
</script>

<div
	class="repo"
	on:mouseenter={() => (showActions = true)}
	on:mouseleave={() => (showActions = true)}
	use:autoAnimate
>
	<div class="repo-main">
		<a href={`/repo/${owner}/${name}`}>
			<h2 class="repo-title" title={`${owner}/${name}`}>
				<span class="repo-owner">{owner}/</span>
				<span class="repo-name">{name}</span>
			</h2>
		</a>

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
						<span title={updatedAt}>{calculateLastUpdated(updatedAt)}</span>
					</p>
				</aside>

				<Stats {stars} {forks} {issues} />
			</div>
		</div>
	</div>

	{#if showActions}
		<ul class="actions" class:show={showActions}>
			<li>
				<a href={url} target="_blank" rel="noreferrer">
					<Icon name="github" size={16} />
				</a>
			</li>

			<li>
				<a href={website} target="_blank" rel="noreferrer" class:disabled={!website}>
					<Icon name="globe" size={16} />
				</a>
			</li>

			<li>
				<a href={`/repo/${owner}/${name}`}>
					<Icon name="maximize" size={16} />
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
	}

	.repo-main {
		padding: 1rem;
	}

	.repo-title {
		font-family: var(--font-mono);
		text-align: center;
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;

		.repo-owner {
			font-size: 0.9rem;
			line-height: 1em;
			color: var(--darker-gray);
			text-align: start;
		}

		.repo-name {
			@include ellipsis;
			font-style: italic;
		}
	}

	.repo-description {
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
		line-height: 1.2em;
		font-family: var(--font-mono);
		text-align: justify;

		@include lines(3);
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
		right: 2px;
		top: 2px;

		display: flex;
		justify-content: flex-end;
		background-color: var(--primary-color);
		padding: 0.2rem;
		border-radius: 0.8rem;

		transform: scale(1);
		transition: transform 0.1s ease-in-out;

		&:hover {
			transform: scale(1.2);
		}

		a {
			padding: 0.5rem;
			color: black;

			&:hover {
				background-color: gray;
				opacity: 0.5;
			}
		}
	}
</style>
