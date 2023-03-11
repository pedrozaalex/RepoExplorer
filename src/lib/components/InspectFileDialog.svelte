<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getFileContents } from '../api/github';
	import CodeViewer from './CodeViewer.svelte';
	import DisplayQuery from './DisplayQuery.svelte';
	import Modal from './Modal.svelte';

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	export let owner: string;
	export let name: string;
	export let file: { name: string; path: string; downloadUrl?: string | undefined };
	export let isOpen: boolean;

	$: filename = file.name;
	$: downloadUrl = file.downloadUrl;

	const fetchContentsResult = getFileContents({ owner, name, path: file.path });
</script>

{#if isOpen}
	<Modal on:close={close} header={file.name}>
		<DisplayQuery query={fetchContentsResult}>
			{@const code = $fetchContentsResult.data}

			{#if code}
				<CodeViewer {code} {filename} {downloadUrl} />
			{:else}
				<div class="centered">
					<p>File is empty</p>
				</div>
			{/if}
		</DisplayQuery>
	</Modal>
{/if}

<style lang="scss">
	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
