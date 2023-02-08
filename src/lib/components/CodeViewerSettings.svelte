<script lang="ts">
	import { clickOutside } from '$lib/utils';
	import {
		codeViewerSettingsStore,
		CodeViewerTheme,
		setFontSize,
		setLineHeight,
		setTheme
	} from './CodeViewer.svelte';
	import Icon from './Icon.svelte';

	let isOpen = false;

	let fontSizeInput: HTMLInputElement;
	let lineHeightInput: HTMLInputElement;
	let themeSelect: HTMLSelectElement;

	$: toggleMenu = () => (isOpen = !isOpen);

	function handleSave() {
		setFontSize(fontSizeInput.value);
		setLineHeight(lineHeightInput.value);
		setTheme(themeSelect.value as CodeViewerTheme);
		isOpen = false;
	}
</script>

<button on:click={toggleMenu} class="toggle-button" class:open={isOpen}>
	<Icon name="settings" />
</button>

{#if isOpen}
	<form class="menu" use:clickOutside on:click_outside={() => (isOpen = false)}>
		<div class="menu-item">
			<label for="font-size">Font Size</label>
			<input
				type="range"
				id="font-size"
				min="4"
				max="24"
				step="1"
				value={$codeViewerSettingsStore.fontSize}
				on:change={(e) => setFontSize(e.target.value)}
			/>
		</div>
		<div class="menu-item">
			<label for="line-height">Line Height</label>
			<input
				type="range"
				id="line-height"
				min="1"
				max="3"
				step="0.1"
				value={$codeViewerSettingsStore.lineHeight}
				on:change={(e) => setLineHeight(e.target.value)}
			/>
		</div>
		<div class="menu-item">
			<label for="theme">Theme</label>
			<select
				id="theme"
				value={$codeViewerSettingsStore.theme}
				on:change={(e) => setTheme(e.target.value)}
			>
				<option value={CodeViewerTheme.EightiesDark}>Eighties Dark</option>
				<option value={CodeViewerTheme.InspiredGitHub}>Inspired GitHub</option>
				<option value={CodeViewerTheme.MochaDark}>Mocha Dark</option>
				<option value={CodeViewerTheme.OceanDark}>Ocean Dark</option>
				<option value={CodeViewerTheme.OceanLight}>Ocean Light</option>
				<option value={CodeViewerTheme.SolarizedDark}>Solarized Dark</option>
				<option value={CodeViewerTheme.SolarizedLight}>Solarized Light</option>
			</select>
		</div>
	</form>
{/if}

<style lang="scss">
	@import '../mixins.scss';

	.toggle-button {
		background: var(--primary-color);
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
		top: 2.5rem;
		right: 0;
		width: 15rem;
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.menu-actions {
		margin: 0 1rem;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		margin-top: 1rem;

		button {
			@include clickable;
			cursor: pointer;
			background-color: var(--primary-color);
			border-radius: 9999px;
			padding: 0.5rem 1rem;

			&[type='submit'] {
				background-color: var(--secondary-color);
			}
		}
	}

	label {
		margin-right: 0.5rem;
	}

	input[type='range'] {
		width: 100%;
	}

	select {
		width: 100%;
	}
</style>
