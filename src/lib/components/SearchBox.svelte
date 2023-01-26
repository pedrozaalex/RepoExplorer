<script lang="ts">
	import { goto } from '$app/navigation';
	import { assets } from '../../assets';

	export let searchTerm = '';

	function search() {
		console.log('navigating to search page', searchTerm);

		goto(`/search/${searchTerm}`);
	}
</script>

<div class="search-box">
	<input
		bind:value={searchTerm}
		placeholder="Your search term..."
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				search();
			}
		}}
	/>
	<button on:click={search}>
		<img src={assets.magnifyingGlass} alt="Search" width="36" />
	</button>
</div>

<style lang="scss">
	.search-box {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem 0;
		padding: 0.25rem;
		background-color: white;
		border-radius: 9999px;
		width: fit-content;
		margin: 0 auto;
		box-shadow: var(--shadow);
		border: 4px solid var(--outline-color);
		input {
			width: 100%;
			padding: 0.5rem;
			font-size: 1rem;
			background-color: transparent;
			border: 0 none;
		}

		button {
			margin-left: 0.5rem;
			padding: 0.5rem;
			background: none;
			cursor: pointer;
		}
	}
</style>
