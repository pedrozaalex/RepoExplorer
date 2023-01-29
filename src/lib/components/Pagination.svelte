<script lang="ts">
	import Button from './Button.svelte';

	export let page: number;
	export let totalItems: number;
	export let itemsPerPage: number;

	$: totalPages = Math.ceil(totalItems / itemsPerPage);
</script>

<nav>
	{#if page > 1}
		<a href={`?page=${page - 1}`}>
			<Button>&lt;</Button>
		</a>
	{/if}

	{#if page < totalPages}
		<a href={`?page=${page + 1}`}>
			<Button>&gt;</Button>
		</a>
	{/if}
</nav>

<style lang="scss">
	nav {
		margin: 1rem 0;
		display: flex;
		justify-content: center;

		a {
			padding: 0.5rem 1rem;
			border-radius: 9999px;
		}
	}
</style>
