<script lang="ts">
	import Error from '$components/Error.svelte';
	import { fly } from 'svelte/transition';
	import { searchRepos } from '$lib/api/github';
	import Pagination from '$lib/components/Pagination.svelte';
	import RepositoryCard from '$lib/components/RepositoryCard.svelte';
	import type { PageData } from './$types';

	const PER_PAGE = 12;

	export let data: PageData;

	$: page = data.page;
	$: searchTerm = data.searchTerm;
	$: searchResult = searchRepos({ page, perPage: PER_PAGE, searchTerm });

	let totalItems = 0;
	let totalPages = 0;

	// Reset the total items and pages when the search term changes
	$: if (searchTerm) {
		totalItems = 0;
		totalPages = 0;
	}

	// Update the total items and pages when the search result is ready
	$: if ($searchResult.isSuccess) {
		totalItems = $searchResult.data.totalItems;
		totalPages = Math.ceil(totalItems / PER_PAGE);
	}
</script>

<div class="page-root">
	{#if totalItems > PER_PAGE}
		<div>
			<p>Showing page {page} of {totalPages} ({totalItems} results)</p>
			<Pagination {page} {totalItems} perPage={PER_PAGE} />
		</div>
	{/if}

	{#if $searchResult.isLoading}
		<p>Searching...</p>
	{:else if $searchResult.isError}
		<Error query={$searchResult} />
	{:else if $searchResult.isSuccess}
		{@const repositories = $searchResult.data.items}

		<div class="search-results">
			{#each repositories as repo}
				<div transition:fly={{ y: 200, duration: 200 }}>
					<RepositoryCard data={repo} />
				</div>
			{:else}
				<p>No results found</p>
			{/each}
		</div>
	{/if}

	{#if totalItems > PER_PAGE}
		<Pagination {page} {totalItems} perPage={PER_PAGE} />
	{/if}
</div>

<style lang="scss">
	.page-root {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		max-width: 100vw;
		min-height: 100vh;
	}

	.search-results {
		display: flex;
		gap: 2.5rem;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: flex-start;
		max-width: 100%;

		& > div {
			width: 80%;

			@media screen and (min-width: 768px) {
				width: 45%;
			}

			@media screen and (min-width: 1024px) {
				width: 30%;
			}
		}
	}
</style>
