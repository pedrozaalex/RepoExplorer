<script lang="ts">
	import { assets, type Asset } from '../../assets';

	export let onClick: () => void = () => {};

	export let leftIcon: Asset | null = null;
	export let rightIcon: Asset | null = null;
</script>

<!-- 
	@component
	Standard button component following the project's design system.
	
	- `leftIcon` and `rightIcon` are optional props that can be used to add an icon to the button.
	- If provided, `onClick` will be called when the button is clicked.
	- The button can be styled using CSS variables:
		- `--background` and `--color` are used to set the background and text color of the button.
		- `--outline-color` is used to set the border color of the button.
 -->
<button class="button-root" on:click={onClick}>
	{#if leftIcon}
		<img src={assets[leftIcon]} alt="" />
	{/if}

	<slot />

	{#if rightIcon}
		<img src={assets[rightIcon]} alt="" />
	{/if}
</button>

<style lang="scss">
	.button-root {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 1rem;
		height: 3rem;
		border-radius: 1000px;
		background-color: var(--background, var(--primary-color));
		color: var(--color, var(--on-primary-color));
		cursor: pointer;
		box-shadow: var(--shadow);
		border: 4px solid var(--outline-color);
		font-family: 'Space Mono', monospace;
		font-weight: 700;

		transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

		&:hover {
			transform: translate(-2px, 2px);
			box-shadow: var(--shadow-small);
		}

		&:active {
			transform: translate(-4px, 4px);
			box-shadow: 0 0 0 0;
		}
	}

	.button-root > img {
		height: 24px;
	}

	.button-root > img:first-child {
		margin-right: 8px;
	}

	.button-root > img:last-child {
		margin-left: 8px;
	}
</style>
