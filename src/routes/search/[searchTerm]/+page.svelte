<script lang="ts">
	import { searchRepos } from '../../../lib/api/github';
	import Pagination from '../../../lib/components/Pagination.svelte';
	import Repo from '../../../lib/components/Repo.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const perPage = 10;

	$: ({ searchTerm = '', page = 1 } = data);

	$: query = searchRepos({
		searchTerm,
		page,
		perPage
	});
</script>

<div>
	{#if $query.isLoading}
		Searching...
	{:else if $query.isError}
		<p>Error: {$query.error}</p>
	{:else if $query.isSuccess}
		{#if $query.data.totalCount === 0}
			<p>No results found</p>
		{:else}
			<p>Found {$query.data.totalCount} results</p>

			<br />
		{/if}

		<div class="search-results">
			{#each $query.data.items as repoData}
				<Repo data={repoData} />
			{/each}
		</div>

		{#if $query.data.totalCount > perPage}
			<Pagination {page} totalItems={$query.data.totalCount} itemsPerPage={perPage} />
		{/if}
	{/if}
</div>

<style lang="scss">
	.search-results {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
</style>
