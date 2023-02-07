<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import { createEventDispatcher } from 'svelte';
	import { getRepoContents } from '../api/github';
	import CodeViewer from './CodeViewer.svelte';
	import Modal from './Modal.svelte';

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	export let owner: string;
	export let name: string;
	export let file: { name: string; path: string };

	const fetchContentsResult = getRepoContents({ owner, name, path: file.path });
</script>

<Modal on:close={close} header={file.name}>
	{#if $fetchContentsResult.isLoading}
		<p>Loading...</p>
	{:else if $fetchContentsResult.error}
		<p>Error: {$fetchContentsResult.error}</p>
	{:else if $fetchContentsResult.data}
		{@const code = $fetchContentsResult.data[0].content ?? ''}

		<CodeViewer {code} />
	{/if}
</Modal>
