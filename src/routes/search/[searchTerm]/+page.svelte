<script lang="ts">
	import { searchRepos } from '../../../lib/api/github';
	import Repo from '../../../lib/components/Repo.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ searchTerm = '', page = 1 } = data);

	$: query = searchRepos({
		searchTerm,
		page
	});
</script>

<div class="search-results">
	{#if $query.isLoading}
		Searching...
	{:else if $query.isError}
		<p>Error: {$query.error}</p>
	{:else if $query.isSuccess}
		{#each $query.data.items as repo}
			<Repo
				data={{
					url: repo.html_url,
					fullName: repo.full_name,
					description: repo.description || 'No description',
					stars: repo.stargazers_count,
					forks: repo.forks_count,
					issues: repo.open_issues_count,
					lastUpdated: repo.updated_at,
					license: repo.license?.name || 'No license'
				}}
			/>
		{/each}
	{/if}
</div>

<style lang="scss">
	.search-results {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
	}
</style>
