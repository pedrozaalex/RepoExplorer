<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: ({ owner, name } = data);

	$: tabs = ['about', 'files', 'stats'];

	$: selected = $page.data.selectedRepoTab;
</script>

<div class="root">
	<h1>{owner}/{name}</h1>

	<nav class="tabs">
		{#each tabs as tab}
			<a
				href={`/repo/${owner}/${name}/${tab}`}
				class="tab-selector"
				class:selected={tab === selected}
			>
				{tab}
			</a>
		{/each}
	</nav>

	<div class="repo">
		<slot />
	</div>
</div>

<style lang="scss">
	.root {
		min-height: 70vh;
		min-height: 70dvh;
	}

	h1 {
		margin: 2rem;
		margin-top: 0;
	}

	.tabs {
		margin-left: 2rem;
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
	}

	.tab-selector {
		padding: 0.5rem 1rem;
		background-color: var(--outline-color);
		color: black;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		font-weight: bold;
		filter: brightness(0.8);
		transition: all 0.1s ease-in-out;
		cursor: pointer;

		&.selected {
			filter: brightness(1);
			padding-bottom: 1rem;
		}

		&:hover {
			filter: brightness(1);
		}
	}

	.repo {
		width: 100vw;
		max-width: 800px;
		margin: 0 auto;
		background-color: white;
		color: black;
		border: var(--primary-border);
		border-radius: 2rem;
		box-shadow: var(--shadow);
	}
</style>
