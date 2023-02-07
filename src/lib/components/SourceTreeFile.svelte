<script lang="ts" context="module">
	const collapseFileFns: { [key: string]: () => void } = {};

	function collapseAllFiles() {
		Object.values(collapseFileFns).forEach((collapseFile) => collapseFile());
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { slide } from 'svelte/transition';
	import { getRepoContents } from '../api/github';
	import CodeViewer from './CodeViewer.svelte';
	import Icon from './Icon.svelte';
	import Modal from './Modal.svelte';

	export let owner: string;
	export let name: string;
	export let file: { name: string; path: string };

	let expanded = false;
	$: fetchContentsResult = getRepoContents({ owner, name, path: file.path });

	function openFile() {
		collapseAllFiles();
		expanded = true;
	}

	function closeFile() {
		expanded = false;
	}

	onMount(() => {
		const componentId = file.path + Date.now();
		const collapseFile = () => (expanded = false);

		collapseFileFns[componentId] = collapseFile.bind(null);

		return () => {
			delete collapseFileFns[componentId];
		};
	});
</script>

<li transition:slide={{ duration: 100 }}>
	<button class="file" on:click={openFile}>
		<Icon name="file" />
		{file.name}
	</button>

	{#if expanded}
		<Modal on:close={closeFile} header={file.name}>
			{#if $fetchContentsResult.isLoading}
				<p>Loading...</p>
			{:else if $fetchContentsResult.error}
				<p>Error: {$fetchContentsResult.error}</p>
			{:else if $fetchContentsResult.data}
				{@const code = $fetchContentsResult.data[0].content ?? ''}

				<CodeViewer {code} />
			{/if}
		</Modal>
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
	}

	.file {
		&:hover {
			cursor: pointer;
			background-color: rgba($color: rgb(186, 170, 255), $alpha: 0.3);
			text-decoration: underline;
		}
	}
</style>
