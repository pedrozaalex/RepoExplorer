<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import { searchRepos } from '../../../lib/api/github';
	import Pagination from '../../../lib/components/Pagination.svelte';
	import Repository, { type StandardRepo } from '../../../lib/components/Repository.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const perPage = 12;
	let repos: StandardRepo[] = [];
	let totalItems = 0;
	$: totalPages = Math.ceil(totalItems / perPage);
	$: page = data.page;
	$: searchTerm = data.searchTerm;
	$: searchResult = searchRepos({ page, perPage, searchTerm });
	$: searchResult.then((result) => {
		repos = result?.items || [];
		totalItems = result?.totalItems || 0;
	});
	// Reset data whenever the page changes
	$: {
		repos = [];
		totalItems = 0;
		data
	}
</script>

<div use:autoAnimate>
	{#await searchResult}
		<p>Searching...</p>
	{:catch error}
		<p>Error: {error}</p>
	{/await}

	{#if totalItems > perPage}
		<p>
			Showing page {page} of {totalPages} ({totalItems} results)
		</p>
	{/if}

	<br />

	<div class="search-results">
		{#each repos as repo}
			<Repository data={repo} />
		{:else}
			{#await searchResult then result}
				{#if result?.totalItems === 0}
					<p>No results found</p>
				{/if}
			{/await}
		{/each}
	</div>

	<br />

	{#if totalItems > perPage}
		<Pagination {page} {totalItems} {perPage} />
	{/if}
</div>

<style lang="scss">
	.search-results {
		display: flex;
		gap: 2.5rem;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: flex-start;
	}
</style>
