<script lang="ts">
	import { getRepoLanguagues } from '$lib/api/github';
	import { getLanguageHSLColor, lightenHSL } from '../utils';
	import Error from './Error.svelte';
	import LangChip from './LangChip.svelte';
	import SkeletonLoader from './SkeletonLoader.svelte';

	export let owner: string;
	export let name: string;

	$: fetchLangsResult = getRepoLanguagues({ owner, name });
	$: ({ isLoading, data: langs, isSuccess } = $fetchLangsResult);
</script>

<SkeletonLoader height="2rem" {isLoading} />

<Error query={$fetchLangsResult} />

{#if isSuccess && langs}
	<ul class="language-list">
		{#each langs as lang}
			{@const color = getLanguageHSLColor(lang)}
			<LangChip label={lang} --bg-color={color} --text-color={lightenHSL(color)} />
		{:else}
			<p>No languages in repo</p>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.language-list {
		display: flex;
		flex-wrap: wrap;
		overflow-x: hidden;
		gap: 0.3rem;
	}
</style>
