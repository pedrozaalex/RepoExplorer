<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from './Icon.svelte';

	export let page: number;
	export let totalItems: number;
	export let perPage: number;

	$: totalPages = Math.ceil(totalItems / perPage);

	let pageInput: HTMLInputElement;
	const goToPage = () => {
		const newPage = Number(pageInput.value);
		if (newPage > 0 && newPage <= totalPages) {
			goto(`?page=${newPage}`);
		} else {
			alert('Invalid page number! Please enter a number between 1 and ' + totalPages);
		}
	};
</script>

<nav class="pagination">
	<a class="pagination-link" class:disabled={page <= 1} href={`?page=${page - 1}`}>
		<iconify-icon icon="material-symbols:arrow-back-rounded" height="24" />
	</a>

	<form on:submit|preventDefault={goToPage} class="pagination-input">
		<input bind:this={pageInput} type="number" min="1" max={totalPages} value={page} />
		<button type="submit" class:disabled={page > totalPages || page < 1}>Go</button>
	</form>

	<a class="pagination-link" class:disabled={page >= totalPages} href={`?page=${page + 1}`}>
		<iconify-icon icon="material-symbols:arrow-forward-rounded" height="24" />
	</a>
</nav>

<style lang="scss">
	@import '../mixins.scss';

	.pagination {
		margin: 2rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.pagination-link {
		@include clickable;
		background-color: var(--primary-color);
		color: var(--on-primary-color);
		height: 2rem;
		width: 2rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pagination-input {
		display: flex;
		align-items: stretch;

		input {
			max-width: 7.5rem;
			padding: 0.5rem;
			background-color: white;
			border: 0 none;
			border-top-left-radius: 9999px;
			border-bottom-left-radius: 9999px;
		}

		button {
			@include clickable;
			$radius: 2.5rem;
			width: $radius;
			height: $radius;
			border-top-right-radius: 50%;
			border-bottom-right-radius: 50%;
			background-color: var(--primary-color);
			color: var(--on-primary-color);
			text-transform: uppercase;
			font-weight: 700;
		}
	}
</style>
