<script lang="ts">
	import { slide } from 'svelte/transition';
	import { getRepoContents } from '../api/github';
	import SourceTreeFile from './SourceTreeFile.svelte';

	export let owner: string;
	export let name: string;
	export let folder: { name: string; path: string };

	$: fetchTreeResult = getRepoContents({ owner, name, path: folder.path });

	let isExpanded = false;
	function toggle() {
		isExpanded = !isExpanded;
	}
</script>

<li class="root" transition:slide={{ duration: 100 }}>
	<button class="folder" class:expanded={isExpanded} on:click={toggle}>
		<iconify-icon
			icon={isExpanded ? 'material-symbols:folder-open-rounded' : 'material-symbols:folder'}
			height="20" />
		{folder.name}
	</button>

	{#if isExpanded}
		{#if $fetchTreeResult.isLoading}
			<p>Loading...</p>
		{:else if $fetchTreeResult.error}
			<p>Error: {$fetchTreeResult.error}</p>
		{:else if $fetchTreeResult.data}
			{@const folders = $fetchTreeResult.data.filter(file => file.type === 'dir')}
			{@const files = $fetchTreeResult.data.filter(file => file.type === 'file')}

			<ul>
				{#each folders as folder}
					<svelte:self {owner} {name} {folder} />
				{/each}

				{#each files as file}
					<SourceTreeFile {owner} {name} {file} />
				{/each}
			</ul>
		{/if}
	{/if}
</li>

<style lang="scss">
	li {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.5rem;

		button {
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			background: none;
		}

		ul {
			padding-left: 2rem;
		}
	}

	.folder {
		font-weight: bold;
		cursor: pointer;

		&:hover {
			background-color: rgba($color: rgb(186, 170, 255), $alpha: 0.3);
			text-decoration: underline;
		}

		&:hover,
		&.expanded {
			color: var(--on-primary-color);
		}
	}
</style>
