<script lang="ts" context="module">
	const collapseFileFns: { [key: string]: () => void } = {};

	function collapseAllFiles() {
		Object.values(collapseFileFns).forEach((collapseFile) => collapseFile());
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import InspectFileDialog from './InspectFileDialog.svelte';

	export let owner: string;
	export let name: string;
	export let file: { name: string; path: string };

	let expanded = false;

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
		<iconify-icon icon="mdi:file-document-outline" height="20" />
		{file.name}
	</button>

	{#if expanded}
		<InspectFileDialog {owner} {name} {file} on:close={closeFile} />
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
