<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
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

<div use:autoAnimate>
	{#await searchResult}
		<p>Searching...</p>
	{:then results}
		{#if results}
			{#if results.totalItems > perPage}
				<Pagination {page} totalItems={results.totalItems} itemsPerPage={perPage} />
			{/if}

			<br />

			<div class="search-results">
				{#each results.items as repo}
					<Repository data={repo} />
				{:else}
					<p>No results found</p>
				{/each}
			</div>

			<br />

			{#if results.totalItems > perPage}
				<Pagination {page} totalItems={results.totalItems} itemsPerPage={perPage} />
			{/if}
		{/if}
	{:catch error}
		<p>Error: {error}</p>
	{/await}
</div>

<style lang="scss">
	.search-results {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
</style>
