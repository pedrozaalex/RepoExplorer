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
	import { calculateLastUpdated } from '$lib/utils';

	import autoAnimate from '@formkit/auto-animate';
	import { getRepoLanguagues } from '../api/github';
	import LanguageList from './LanguageList.svelte';
	import SkeletonLoader from './SkeletonLoader.svelte';
	import Stats from './Stats.svelte';

	export let data: StandardRepo;

	const { description, forks, issues, license, name, owner, stars, updatedAt, url } = data;

	let langsQuery = getRepoLanguagues({ owner, name });
</script>

<div class="repo">
	<a href={url} target="_blank" rel="noreferrer">
		<h2 class="repo-title" title={`${owner}/${name}`}>
			<span class="repo-owner">{owner}/</span>
			<span class="repo-name">{name}</span>
		</h2>
	</a>

	<p class="repo-description" title={description}>{description}</p>

	<div use:autoAnimate>
		{#if $langsQuery.isLoading}
			<SkeletonLoader height="2rem" />
		{:else if $langsQuery.isError}
			<p>Error: {$langsQuery.error}</p>
		{:else if $langsQuery.isSuccess}
			{@const langs = $langsQuery.data}
			<LanguageList {langs} />
		{/if}

		<div class="repo-stats">
			<aside>
				<p>
					License:
					<br />
					<span title={license}>{license}</span>
				</p>

				<p>
					Last update:
					<br />
					<span title={updatedAt}>{calculateLastUpdated(updatedAt)}</span>
				</p>
			</aside>

			<Stats {stars} {forks} {issues} />
		</div>
	</div>
</div>

<style lang="scss">
	@mixin ellipsis {
		overflow: hidden;
		word-wrap: break-word;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@mixin lines($lines) {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: $lines;
		line-clamp: $lines;
		-webkit-box-orient: vertical;
		line-height: 1.2em;
		height: 1.2em * $lines;
	}

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
</style>
