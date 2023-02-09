<script lang="ts">
	import type { PageData } from './$types';
	import SourceTree from '$components/SourceTree.svelte';

	export let data: PageData;
	$: ({ owner, name, openFilePath } = data);
</script>

<div class="repo-files-page-root">
	<SourceTree {owner} {name} path={openFilePath} />
</div>

<style lang="scss">
	.repo-files-page-root {
		padding: 1rem;
	}
</style>
