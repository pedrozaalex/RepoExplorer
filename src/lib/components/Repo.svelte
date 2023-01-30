<script lang="ts" context="module">
	export type StandardRepo = {
		url: string;
		fullName: string;
		description: string;
		stars: number;
		updatedAt: string;
		license: string;
	};
</script>

<script lang="ts">
	import { formatDistance, parseISO } from 'date-fns';
	import { getRepoLanguagues } from '../api/github';
	import { pipe } from 'fp-ts/lib/function';
	import Chip from './Chip.svelte';
	import { lightenHSL, stringToColour } from '../utils';

	export let description: StandardRepo['description'];
	export let fullName: StandardRepo['fullName'];
	export let license: StandardRepo['license'];
	export let stars: StandardRepo['stars'];
	export let updatedAt: StandardRepo['updatedAt'];
	export let url: StandardRepo['url'];

	const calculateLastUpdated = (updatedAt: string) =>
		pipe(updatedAt, parseISO, (updatedAt) =>
			formatDistance(updatedAt, new Date(), {
				addSuffix: true
			})
		);

	let langsQuery = getRepoLanguagues(fullName);

	const maxLanguages = 2;
</script>

<div class="repo">
	<a href={url} target="_blank" rel="noreferrer">
		<h2>{fullName}</h2>
	</a>

	<p>{description}</p>

	<div class="repo-stats">
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

		<p>Last updated {calculateLastUpdated(updatedAt)}</p>
		<p>{license}</p>
		<p>{stars} ⭐</p>
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

	h2 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: var(--font-mono);
		text-align: center;
	}

	ul {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: hidden;
		list-style: none;
		gap: 0.3rem;
	}
</style>
