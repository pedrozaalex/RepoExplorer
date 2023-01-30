<script lang="ts">
	import { lightenHSL, stringToColour } from '../utils';
	import Chip from './Chip.svelte';

	export let langs: string[];

	const MAX_LANGUAGES = 2;
</script>

{#if langs.length === 0}
	<p>No languages in repo</p>
{:else}
	<ul class="language-list">
		{#each langs as lang, i}
			{#if i < MAX_LANGUAGES}
				{@const color = stringToColour(lang)}

				<li>
					<Chip label={lang} --bg-color={color} --text-color={lightenHSL(color)} />
				</li>
			{:else if i === MAX_LANGUAGES}
				<li>
					<Chip
						label={`+${langs.length - MAX_LANGUAGES}`}
						title={langs.slice(MAX_LANGUAGES).join(', ')}
					/>
				</li>
			{/if}
		{/each}
	</ul>
{/if}

<style lang="scss">
	.language-list {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: hidden;
		list-style: none;
		gap: 0.3rem;
		margin-bottom: 0.75rem;
	}
</style>
