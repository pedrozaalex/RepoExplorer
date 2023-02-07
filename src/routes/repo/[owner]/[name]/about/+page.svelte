<script lang="ts">
	import { getOneRepo } from '$lib/api/github';
	import Readme from '$lib/components/Readme.svelte';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;

	$: ({ owner, name } = data);
	$: fetchRepoResult = getOneRepo({ owner, name });
	$: ({ data: repo, isLoading, error } = $fetchRepoResult);
</script>

<div class="repo-about-page-root">
	{#if isLoading}
		<p>Loading...</p>
	{:else if error}
		<p>Error: {error}</p>
	{:else if repo}
		<h2>About</h2>
		<p>{repo.description}</p>
		<br />
		<h2>README</h2>
		<Readme {owner} {name} />
	{:else}
		<p>Repo not found</p>
	{/if}
</div>

<style lang="scss">
	.repo-about-page-root {
		padding: 2rem;
	}
</style>
