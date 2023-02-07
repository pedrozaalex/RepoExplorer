<script lang="ts">
	import { slide } from 'svelte/transition';
	import { getRepoContents } from '../api/github';
	import Icon from './Icon.svelte';
	import SourceTreeFile from './SourceTreeFile.svelte';

	export let owner: string;
	export let name: string;
	export let folder: { name: string; path: string };

	$: fetchTreeResult = getRepoContents({ owner, name, path: folder.path });
	let expanded = false;
</script>

<li class="root" transition:slide={{ duration: 100 }}>
	<button class="folder" on:click={() => (expanded = !expanded)}>
		<Icon name={expanded ? 'folderCollapse' : 'folderExpand'} />
		{folder.name}
	</button>

	{#if expanded}
		{#if $fetchTreeResult.isLoading}
			<p>Loading...</p>
		{:else if $fetchTreeResult.error}
			<p>Error: {$fetchTreeResult.error}</p>
		{:else if $fetchTreeResult.data}
			{@const folders = $fetchTreeResult.data.filter((file) => file.type === 'dir')}
			{@const files = $fetchTreeResult.data.filter((file) => file.type === 'file')}

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
		align-items: flex-start;
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
	}
</style>
