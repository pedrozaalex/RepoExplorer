<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	import InspectFileDialog from './InspectFileDialog.svelte';

	export let owner: string;
	export let name: string;
	export let file: { name: string; path: string };

	let isOpen = false;
	const openFile = () => (isOpen = true);
	const closeFile = () => (isOpen = false);
</script>

<li transition:slide={{ duration: 100 }}>
	<button class="file" on:click={openFile}>
		<iconify-icon icon="mdi:file-document-outline" height="20" />
		{file.name}
	</button>

	<InspectFileDialog {owner} {name} {file} {isOpen} on:close={closeFile} />
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
			color: var(--on-primary-color);
		}
	}
</style>
