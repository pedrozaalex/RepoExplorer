<script lang="ts" context="module">
	export type StandardRepo = {
		url: string;
		fullName: string;
		description: string;
		stars: number;
		forks: number;
		issues: number;
		lastUpdated: string;
		license: string;
	};
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { createQuery } from '@tanstack/svelte-query';
	import { formatDistance } from 'date-fns';
	import { authStore } from '../stores/authStore';

	export let data: StandardRepo;

	$: formattedDate = formatDistance(new Date(data.lastUpdated), new Date(), {
		addSuffix: true
	});

	let langsQuery = createQuery({
		queryKey: ['languages', data.fullName],
		queryFn: async () => {
			if (!browser) return {};

			const octokit = $authStore.octokit;

			if (!octokit) return {};

			const { data: langs } = await octokit.rest.repos.listLanguages({
				owner: data.fullName.split('/')[0],
				repo: data.fullName.split('/')[1]
			});

			return langs;
		}
	});
</script>

<div class="repo">
	<a href={data.url} target="_blank" rel="noreferrer">
		<h2>{data.fullName}</h2>
	</a>

	<p>{data.description}</p>

	<div class="repo-stats">
		<p>{data.stars} ⭐</p>
		<p>{data.forks} 🍴</p>
		<p>{data.issues} ❓</p>
		<p>Last updated {formattedDate}</p>
		<p>{data.license}</p>

		{#if $langsQuery.isLoading}
			Searching...
		{:else if $langsQuery.isError}
			<p>Error: {$langsQuery.error}</p>
		{:else if $langsQuery.isSuccess}
			{#each Object.keys($langsQuery.data) as lang}
				<p>{lang}</p>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	.repo {
		width: 100%;

		@media screen and (min-width: 768px) {
			width: 40%;
		}

		h2 {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		p {
			margin: 0;
		}
	}
</style>
