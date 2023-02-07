<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let header: string | null = null;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close();
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	});
</script>

<div class="modal-root">
	<div
		class="modal-overlay"
		on:click={close}
		on:keypress={handleKeyPress}
		transition:fade={{ duration: 100 }}
	/>

	<div class="modal-body" transition:fly={{ duration: 100, delay: 100, y: 100 }}>
		{#if header}
			<h2 class="modal-header">{header}</h2>
		{/if}

		<div class="modal-content">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.modal-root {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		width: 100dvw;
		height: 100vh;
		height: 100dvh;
		z-index: 1000;
	}

	.modal-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.modal-body {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 45rem;
		max-height: 80vh;
		background-color: #fff;
		border-radius: 8px;
	}

	$headerHeight: 4rem;

	.modal-header {
		height: $headerHeight;
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		border-bottom: 1px solid #eee;
		margin-right: 4rem;
	}

	.modal-content {
		padding: 1rem;
		max-height: calc(80vh - $headerHeight);
		overflow: scroll;
	}
</style>
