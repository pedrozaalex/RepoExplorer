<script lang="ts">
	import { HighlightAuto } from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github';

	export let code: string;
</script>

<svelte:head>
	{@html github}
</svelte:head>

<div class="code-viewer-root">
	<HighlightAuto {code} />
</div>

<style lang="scss">
	.code-viewer-root {
		overflow: auto;
	}
</style>
