<script lang="ts">
	import { getRepoLanguagues } from '$lib/api/github';
	import { lightenHSL, stringToColour } from '../utils';
	import LangChip from './LangChip.svelte';
	import Error from './Error.svelte';
	import SkeletonLoader from './SkeletonLoader.svelte';

	export let owner: string;
	export let name: string;

	let langsQuery = getRepoLanguagues({ owner, name });

	const MAX_LANGUAGES = 2;
</script>

<div class="root">
	<SkeletonLoader height="2rem" isLoading={$langsQuery.isLoading} />

	<Error query={$langsQuery} />

	{#if $langsQuery.isSuccess}
		{#if $langsQuery.data.length === 0}
			<p>No languages in repo</p>
		{:else}
			<ul class="language-list">
				{#each $langsQuery.data as lang, i}
					{#if i < MAX_LANGUAGES}
						{@const color = stringToColour(lang)}

						<LangChip label={lang} --bg-color={color} --text-color={lightenHSL(color)} />
					{:else if i === MAX_LANGUAGES}
						{@const remainingLength = $langsQuery.data.length - MAX_LANGUAGES}
						{@const remainingLanguages = $langsQuery.data.slice(MAX_LANGUAGES)}

						<LangChip label="+{remainingLength}" title={remainingLanguages.join(', ')} />
					{/if}
				{/each}
			</ul>
		{/if}
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
