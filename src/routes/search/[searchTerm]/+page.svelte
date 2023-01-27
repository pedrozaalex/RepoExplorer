<script lang="ts">
	import { authStore } from '../../../lib/stores/authStore';
	import type { PageData } from './$types';

	export let data: PageData;

	const result = $authStore.octokit?.rest.search
		.repos({
			// We know for sure that data.searchTerm is defined, otherwise we wouldn't be in this page
			q: data.searchTerm!,
			sort: 'stars',
			order: 'desc',
			per_page: 100,
			page: data.page
		})
		.then(({ data }) => data);
</script>

<div class="search-results">
	{#if result}
		{#await result}
			Searching...
		{:then { items }}
			{#each items as repo}
				<div class="repo">
					<a href={repo.html_url} target="_blank" rel="noreferrer">
						<h2>{repo.full_name}</h2>
					</a>
					<p>{repo.description}</p>
					<div class="repo-stats">
						<div class="repo-stat">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
								<path
									fill-rule="evenodd"
									d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 15a7 7 0 110-14 7 7 0 010 14z"
								/>
								<path
									fill-rule="evenodd"
									d="M8 3a.75.75 0 00-.75.75v5.69l-2.22 2.22a.75.75 0 101.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5A.75.75 0 008 3z"
								/>
							</svg>
							{repo.stargazers_count}
						</div>
						<div class="repo-stat">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
								<path
									fill-rule="evenodd"
									d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 15a7 7 0 110-14 7 7 0 010 14z"
								/>
								<path
									fill-rule="evenodd"
									d="M8 3a.75.75 0 00-.75.75v5.69l-2.22 2.22a.75.75 0 101.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5A.75.75 0 008 3z"
								/>
							</svg>
							{repo.forks_count}
						</div>
						<div class="repo-stat">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
								<path
									fill-rule="evenodd"
									d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 15a7 7 0 110-14 7 7 0 010 14z"
								/>
								<path
									fill-rule="evenodd"
									d="M8 3a.75.75 0 00-.75.75v5.69l-2.22 2.22a.75.75 0 101.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5A.75.75 0 008 3z"
								/>
							</svg>
							{repo.open_issues_count}
						</div>
					</div>
				</div>
			{/each}
		{/await}
	{/if}
</div>

<style lang="scss">
	.search-results {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.repo {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid #eee;
		border-radius: 5px;
		padding: 1rem;
		margin: 1rem 0;
		width: 80%;
	}

	.repo a {
		text-decoration: none;
	}

	.repo h2 {
		margin: 0;
	}

	.repo-stat {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		margin-right: 1rem;
	}

	.repo-stat svg {
		margin-right: 0.5rem;
	}
</style>
