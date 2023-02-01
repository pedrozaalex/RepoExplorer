<script lang="ts">
	import { lightenHSL, stringToColour } from '../utils';
	import Chip from './Chip.svelte';

	export let langs: string[];

	const MAX_LANGUAGES = 2;
</script>

<div class="root">
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
