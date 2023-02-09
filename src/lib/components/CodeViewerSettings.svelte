<script lang="ts">
	import {
		codeViewerSettingsStore,
		CodeViewerTheme,
		setFontSize,
		setLineHeight,
		setTheme
	} from './CodeViewer.svelte';

	let isOpen = false;

	$: toggleMenu = () => (isOpen = !isOpen);

	function handleFontSizeChange(e: { currentTarget: HTMLInputElement }) {
		setFontSize(e.currentTarget.value);
	}

	function handleLineHeightChange(e: { currentTarget: HTMLInputElement }) {
		setLineHeight(e.currentTarget.value);
	}

	function handleThemeChange(e: { currentTarget: HTMLSelectElement }) {
		setTheme(e.currentTarget.value as CodeViewerTheme);
	}

	function windowClickHandler() {
		if (isOpen) {
			toggleMenu();
		}
	}
</script>

<button
	on:click|stopPropagation={toggleMenu}
	class="toggle-button"
	class:open={isOpen}
	class:disabled={false}
>
	<iconify-icon icon="ic:baseline-settings" height="24" />
</button>

<svelte:window on:click={windowClickHandler} />

{#if isOpen}
	<div class="menu" on:click|stopPropagation on:keypress={() => {}}>
		<div class="menu-item">
			<iconify-icon icon="radix-icons:font-size" height="24" />
			<input
				type="range"
				id="font-size"
				min="12"
				max="24"
				step="1"
				value={$codeViewerSettingsStore.fontSize}
				on:change={handleFontSizeChange}
			/>
		</div>
		<div class="menu-item">
			<iconify-icon icon="radix-icons:line-height" height="24" />
			<input
				type="range"
				id="line-height"
				min="1.5"
				max="3"
				step="0.1"
				value={$codeViewerSettingsStore.lineHeight}
				on:change={handleLineHeightChange}
			/>
		</div>
		<div class="menu-item">
			<iconify-icon icon="ic:baseline-color-lens" height="24" />
			<select id="theme" value={$codeViewerSettingsStore.theme} on:change={handleThemeChange}>
				<option value={CodeViewerTheme.EightiesDark}>Eighties Dark</option>
				<option value={CodeViewerTheme.InspiredGitHub}>Inspired GitHub</option>
				<option value={CodeViewerTheme.MochaDark}>Mocha Dark</option>
				<option value={CodeViewerTheme.OceanDark}>Ocean Dark</option>
				<option value={CodeViewerTheme.OceanLight}>Ocean Light</option>
				<option value={CodeViewerTheme.SolarizedDark}>Solarized Dark</option>
				<option value={CodeViewerTheme.SolarizedLight}>Solarized Light</option>
			</select>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../mixins.scss';

	.toggle-button {
		background: var(--primary-color);
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		@include clickable;
		opacity: 0.5;
		border-radius: 9999px;

		&.open {
			opacity: 1;
		}
	}

	.menu {
		background-color: white;
		border: 1px solid var(--outline-color);
		border-radius: 0.5rem;
		padding: 1rem;
		position: absolute;
		top: 3rem;
		right: 0;
		width: 15rem;
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		gap: 0.5rem;
	}

	input[type='range'] {
		width: 100%;
	}

	select {
		width: 100%;
	}
</style>
