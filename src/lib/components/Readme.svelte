<script lang="ts">
	import { getRepoReadme } from '$lib/api/github';

	export let owner: string;
	export let name: string;

	$: fetchReadmeResult = getRepoReadme({ owner, name });
	$: ({ data: readme, isLoading, error } = $fetchReadmeResult);
</script>

{#if isLoading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else if readme}
	<div class="markdown-body">
		{@html readme}
	</div>
{:else}
	<p>The repo doesn't seem to have a README</p>
{/if}

<style lang="scss">
	.markdown-body {
		:global(a) {
			color: #0366d6;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}

		:global(h1) {
			font-size: 2rem;
			font-weight: 600;
			margin-top: 1.25rem;
			display: flex;
			align-items: center;
			gap: 0.25rem;
		}

		:global(h2) {
			font-size: 1.5rem;
			font-weight: 600;
			margin-top: 1.25rem;
			display: flex;
			align-items: center;
			gap: 0.25rem;
		}

		:global(h3) {
			font-size: 1.25rem;
			font-weight: 600;
			margin-top: 1.25rem;
			display: flex;
			align-items: center;
			gap: 0.25rem;
		}

		:global(pre) {
			background-color: #f6f8fa;
			border-radius: 1rem;
			font-size: 85%;
			margin: 1rem;
			overflow: auto;
			padding: 1rem;
		}
	}
</style>
