<script lang="ts">
	type ErrorQuery = {
		isError: boolean;
		error: unknown;
	};

	export let query: ErrorQuery;
</script>

{#if query.isError}
	<p>Error: {query.error}</p>
{/if}
