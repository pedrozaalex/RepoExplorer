<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { assets } from '../../assets';

	export let searchTerm = '';

	function search() {
		goto(`/search/${searchTerm}`);
	}

	let input: HTMLInputElement;
	onMount(() => {
		input.focus();
	})
</script>

<form class="search-box" on:submit|preventDefault={search}>
	<input bind:value={searchTerm} placeholder="Your search term..." bind:this={input} />
	<button type="submit">
		<img src={assets.magnifyingGlass} alt="Search" width="36" />
	</button>
</form>

<style lang="scss">
	.search-box {
		display: flex;
		justify-content: center;

		input {
			background-color: white;
			border-radius: 9999px;
			width: 100%;
			padding: 0.5rem;
			padding-left: 1rem;
			padding-right: 3rem;
			font-size: 1rem;
			box-shadow: var(--shadow);
			border: var(--primary-border);
		}

		button {
			margin-left: -3.5rem;
			padding: 0.5rem;
			background: none;
			cursor: pointer;
			border-radius: 9999px;
		}
	}
</style>
