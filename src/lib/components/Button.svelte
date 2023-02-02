<script lang="ts">
	import Icon, { type IconName } from './Icon.svelte';

	export let onClick: (() => void) | null = null;
	export let disabled = false;

	export let leftIcon: IconName | null = null;
	export let rightIcon: IconName | null = null;
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
<button class="button-root" on:click={onClick} {disabled}>
	{#if leftIcon !== null}
		<Icon name={leftIcon} size={16} />
	{/if}

	<div class="button-content">
		<slot />
	</div>

	{#if rightIcon !== null}
		<Icon name={rightIcon} size={16} />
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
		border: var(--primary-border);
		font-family: var(--font-mono);
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

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.button-content {
		margin: 0 0.5rem;
	}
</style>
