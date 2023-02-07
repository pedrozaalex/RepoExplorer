<script>
	import Icon from './Icon.svelte';
</script>

<button>
	<Icon name="settings" />
</button>

<style lang="scss">
	@import '../mixins.scss';

	button {
		background: var(--primary-color);
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		@include clickable;
		opacity: 0.5;
    border-radius: 50%;
	}
</style>
