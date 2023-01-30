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
	};
</script>

<script lang="ts">
	import { formatDistance, parseISO } from 'date-fns';
	import { pipe } from 'fp-ts/lib/function';
	import { checkIfRepoIsStarred, getRepoLanguagues } from '../api/github';
	import { lightenHSL, stringToColour } from '../utils';
	import Chip from './Chip.svelte';
	import Stats from './Stats.svelte';

	export let description: StandardRepo['description'];
	export let forks: StandardRepo['forks'];
	export let issues: StandardRepo['issues'];
	export let name: StandardRepo['name'];
	export let owner: StandardRepo['owner'];
	export let stars: StandardRepo['stars'];
	export let updatedAt: StandardRepo['updatedAt'];
	export let url: StandardRepo['url'];

	let langsQuery = getRepoLanguagues({ owner, name });

	const maxLanguages = 2;

	const calculateLastUpdated = (updatedAt: string) =>
		pipe(updatedAt, parseISO, (updatedAt) =>
			formatDistance(updatedAt, new Date(), {
				addSuffix: true
			})
		);
</script>

<div class="repo">
	<a href={url} target="_blank" rel="noreferrer">
		<h2 class="repo-title">
			<span class="repo-owner">{owner}/</span>
			<span class="repo-name">{name}</span>
		</h2>
	</a>

	<p class="repo-description">{description}</p>

	<div>
		{#if $langsQuery.isLoading}
			<p>Loading...</p>
		{:else if $langsQuery.isError}
			<p>Error: {$langsQuery.error}</p>
		{:else if $langsQuery.isSuccess}
			<ul class="repo-languages">
				{#each $langsQuery.data as lang, i}
					{#if i < maxLanguages}
						{@const color = stringToColour(lang)}

						<li>
							<Chip label={lang} --bg-color={color} --text-color={lightenHSL(color)} />
						</li>
					{:else if i === maxLanguages}
						<li>
							<Chip label={`+${$langsQuery.data.length - maxLanguages}`} />
						</li>
					{/if}
				{/each}
			</ul>
		{/if}

		<div class="repo-stats">
			<aside>
				<p>Last update:</p>
				<p>{calculateLastUpdated(updatedAt)}</p>
			</aside>

			<Stats {stars} {forks} {issues} />
		</div>
	</div>
</div>

<style lang="scss">
	.repo {
		width: 80%;

		background-color: white;
		box-shadow: var(--shadow);
		border: var(--primary-border);
		border-radius: 1rem;
		color: black;
		padding: 1rem;

		@media screen and (min-width: 768px) {
			width: 45%;
		}

		@media screen and (min-width: 1024px) {
			width: 30%;
		}
	}

	.repo-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: var(--font-mono);
		text-align: center;
		line-height: 1.5rem;
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;

		.repo-owner {
			font-size: 1rem;
			color: var(--darker-gray);
			text-align: start;
		}

		.repo-name {
			font-style: italic;
		}
	}

	.repo-description {
		line-height: 1.5rem;
		margin-bottom: 0.75rem;
		font-family: var(--font-mono);
	}

	.repo-languages {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: hidden;
		list-style: none;
		gap: 0.3rem;
		margin-bottom: 0.75rem;
	}

	.repo-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.8rem;
	}
</style>
