<script lang="ts">
	import type { createQuery } from '@tanstack/svelte-query';

	export let query: ReturnType<typeof createQuery>;
</script>

{#if $query.isLoading}
	{#if $$slots.loading}
		<slot name="loading" />
	{:else}
		<p>Loading...</p>
	{/if}
{/if}

{#if $query.isError}
	{#if $$slots.error}
		<slot name="error" />
	{:else}
		<p>Error: {$query.error}</p>
	{/if}
{/if}

{#if $query.isSuccess}
	<slot />
{/if}
