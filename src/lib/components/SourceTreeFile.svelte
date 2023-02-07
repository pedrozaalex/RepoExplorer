<script lang="ts" context="module">
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';

	export let owner: string;
	export let name: string;
	export let file: { name: string; content?: string };
</script>

<li transition:slide={{ duration: 100 }}>
	<button class="file">
		<Icon name="file" />
		{file.name}
	</button>
</li>

<style lang="scss">
	li {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		button {
			cursor: pointer;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			background: none;
		}
	}
</style>
