<script lang="ts">
	import SearchBox from '$components/SearchBox.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: searchBoxPos = data.searchTerm
		? 'top' // if there is a search term, show the search box at the top
		: 'middle'; // otherwise, show it in the middle of the page
</script>

<div class="search-box-container" class:middle={searchBoxPos === 'middle'}>
	<SearchBox searchTerm={data.searchTerm} />
</div>

<slot />

<style lang="scss">
	.search-box-container {
		$duration: 0.2s;

		transition: top $duration ease-in-out, left $duration ease-in-out,
			transform $duration ease-in-out;

		position: absolute;

		top: 2rem;
		left: 50%;
		transform: translateX(-50%);

		&.middle {
			top: 50%;
			left: 50%;
			transform: translate(-50%, 50%);
		}
	}
</style>
