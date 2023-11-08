<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let header: string | null = null;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function keyDownEventListner(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		}
	}

	onMount(() => {
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', keyDownEventListner);

		return () => {
			document.body.style.overflow = 'auto';
			document.removeEventListener('keydown', keyDownEventListner);
		};
	});
</script>

<div class="modal-root">
	<div class="modal-overlay" on:click={close} transition:fade={{ duration: 100 }} />

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
		width: 45rem;
		height: 80vh;
		background-color: #fff;
		border-radius: 8px;
		overflow: hidden;
	}

	.modal-header {
		height: 10%;
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		border-bottom: 1px solid #eee;
		margin-right: 4rem;
		display: flex;
		align-items: center;
	}

	.modal-content {
		padding: 1rem;
		height: 90%;
		width: 100%;
		overflow: hidden;
	}
</style>
