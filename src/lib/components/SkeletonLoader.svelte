<!-- Component for displaying fancy skeleton loading animation -->
<script lang="ts">
	export let width = '100%';
	export let height = '1em';

	export let isLoading: boolean | undefined = undefined;
</script>

{#if isLoading === undefined || isLoading === true}
	<div class="skeleton-box" style="width: {width}; height: {height};" />
{/if}

<style lang="scss">
	.skeleton-box {
		display: inline-block;
		position: relative;
		overflow: hidden;
		background-color: #484848;
		$radius: 0.5em;
		border-radius: $radius;

		&::after {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			transform: translateX(-100%);

			background-image: linear-gradient(
				90deg,
				rgba(#aaa, 0) 0,
				rgba(#aaa, 0.2) 20%,
				rgba(#aaa, 0.5) 60%,
				rgba(#aaa, 0)
			);

			border-radius: $radius;

			animation: shimmer 1s infinite;
			content: '';
		}

		@keyframes shimmer {
			100% {
				transform: translateX(100%);
			}
		}
	}
</style>
