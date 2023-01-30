<script lang="ts">
	import { searchRepos } from '../../../lib/api/github';
	import Pagination from '../../../lib/components/Pagination.svelte';
	import Repository, { type StandardRepo } from '../../../lib/components/Repository.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const perPage = 12;

	$: page = data.page;
	$: searchTerm = data.searchTerm;
	$: searchResult = searchRepos({ page, perPage, searchTerm });
</script>

{#if $searchResult.isLoading}
	Searching...
{:else if $searchResult.isError}
	<p>Error: {$searchResult.error}</p>
{:else}
	{@const { totalCount, items } = $searchResult.data}

	<div class="search-results">
		{#each items as repo}
			<Repository data={repo} />
		{:else}
			<p>No results found</p>
		{/each}
	</div>

	{#if totalCount > perPage}
		<Pagination {page} totalItems={totalCount} itemsPerPage={perPage} />
	{/if}
{/if}

<style lang="scss">
	.search-results {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
</style>
