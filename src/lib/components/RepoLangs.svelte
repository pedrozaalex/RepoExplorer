<script lang="ts">
	import { getRepoLanguagues } from '$lib/api/github';
	import { lightenHSL, stringToColour } from '../utils';
	import LangChip from './LangChip.svelte';
	import Error from './Error.svelte';
	import SkeletonLoader from './SkeletonLoader.svelte';

	export let owner: string;
	export let name: string;

	$: fetchLangsResult = getRepoLanguagues({ owner, name });
	$: ({ isLoading, data: langs, isSuccess } = $fetchLangsResult);

	const MAX_LANGUAGES = 2;
</script>

<div class="root">
	<SkeletonLoader height="2rem" {isLoading} />

	<Error query={$fetchLangsResult} />

	{#if isSuccess && langs}
		<ul class="language-list">
			{#each langs as lang, i}
				{#if i < MAX_LANGUAGES}
					{@const color = stringToColour(lang)}

					<LangChip label={lang} --bg-color={color} --text-color={lightenHSL(color)} />
				{:else if i === MAX_LANGUAGES}
					{@const remainingLength = langs.length - MAX_LANGUAGES}
					{@const remainingLanguages = langs.slice(MAX_LANGUAGES)}

					<LangChip label="+{remainingLength}" title={remainingLanguages.join(', ')} />
				{/if}
			{:else}
				<p>No languages in repo</p>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.root {
		height: 2rem;
	}

	.language-list {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: hidden;
		gap: 0.3rem;
	}
</style>
