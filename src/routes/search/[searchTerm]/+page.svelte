<script lang="ts">
	import Error from '$components/Error.svelte';
	import { fly } from 'svelte/transition';
	import { searchRepos } from '../../../lib/api/github';
	import Pagination from '../../../lib/components/Pagination.svelte';
	import Repository from '../../../lib/components/Repository.svelte';
	import type { PageData } from './$types';

	const PER_PAGE = 12;

	export let data: PageData;

	$: page = data.page;
	$: searchTerm = data.searchTerm;
	$: searchResult = searchRepos({ page, perPage: PER_PAGE, searchTerm });
</script>

<div>
	{#if $searchResult.isLoading}
		<p>Searching...</p>
	{:else if $searchResult.isError}
		<Error query={$searchResult} />
	{:else if $searchResult.isSuccess}
		{@const totalItems = $searchResult.data.totalItems}
		{@const totalPages = Math.ceil(totalItems / PER_PAGE)}
		{@const repositories = $searchResult.data.items}

		{#if totalItems > PER_PAGE}
			<p>Showing page {page} of {totalPages} ({totalItems} results)</p>

			<Pagination {page} {totalItems} perPage={PER_PAGE} />
		{/if}

		<div class="search-results">
			{#each repositories as repo}
				<div transition:fly={{ y: 200, duration: 200 }}>
					<Repository data={repo} />
				</div>
			{:else}
				<p>No results found</p>
			{/each}
		</div>

		{#if totalItems > PER_PAGE}
			<Pagination {page} {totalItems} perPage={PER_PAGE} />
		{/if}
	{/if}
</div>

<style lang="scss">
	.search-results {
		display: flex;
		gap: 2.5rem;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: flex-start;

		& > * {
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
