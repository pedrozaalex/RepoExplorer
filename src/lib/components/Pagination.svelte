<script lang="ts">
	import { goto } from '$app/navigation';
	import { assets } from '../../assets';

	export let page: number;
	export let totalItems: number;
	export let itemsPerPage: number;

	$: totalPages = Math.ceil(totalItems / itemsPerPage);

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
		<img src={assets.arrowLeft} alt="previous" />
	</a>

	<form on:submit|preventDefault={goToPage} class="pagination-input">
		<input bind:this={pageInput} type="number" min="1" max={totalPages} value={page} />
		<button type="submit" class:disabled={page > totalPages || page < 1}>Go</button>
	</form>

	<a class="pagination-link" class:disabled={page >= totalPages} href={`?page=${page + 1}`}>
		<img src={assets.arrowRight} alt="next" />
	</a>
</nav>

<style lang="scss">
	@mixin clickable {
		cursor: pointer;
		filter: brightness(1);
		transition: filter 0.1s;

		&:hover {
			filter: brightness(0.9);
		}

		&:active {
			filter: brightness(0.8);
		}

		&.disabled {
			cursor: not-allowed;
			filter: opacity(0.5);
			pointer-events: none;
		}
	}

	.pagination {
		margin: 1rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.pagination-link {
		@include clickable;
		background-color: var(--primary-color);
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
