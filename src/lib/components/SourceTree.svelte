<script lang="ts">
	import { getRepoContents } from '../api/github';
	import SourceTreeDirectory from './SourceTreeDirectory.svelte';
	import SourceTreeFile from './SourceTreeFile.svelte';

	export let owner: string;
	export let name: string;
	export let path: string | null = null; // path of the opened file, if any

	const fetchTreeResult = getRepoContents({ owner, name, path: '' });
</script>

<div class="root">
	{#if $fetchTreeResult.isLoading}
		<p>Loading...</p>
	{:else if $fetchTreeResult.error}
		<p>Error: {$fetchTreeResult.error}</p>
	{:else if $fetchTreeResult.data}
		{@const folders = $fetchTreeResult.data.filter((file) => file.type === 'dir')}
		{@const files = $fetchTreeResult.data.filter((file) => file.type === 'file')}

		<ul>
			{#each folders as folder}
				<SourceTreeDirectory {owner} {name} {path} {folder} />
			{/each}

			{#each files as file}
				<SourceTreeFile {owner} {name} {path} {file} />
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.root {
		padding: 0;
		position: relative;
	}
</style>
