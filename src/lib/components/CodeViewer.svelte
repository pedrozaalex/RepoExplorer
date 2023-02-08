<script lang="ts" context="module">
	// load settings from local storage
	import { writable } from 'svelte/store';

	export enum CodeViewerTheme {
		OceanDark = 'base16-ocean.dark',
		EightiesDark = 'base16-eighties.dark',
		MochaDark = 'base16-mocha.dark',
		OceanLight = 'base16-ocean.light',
		InspiredGitHub = 'InspiredGitHub',
		SolarizedDark = 'Solarized (dark)',
		SolarizedLight = 'Solarized (light)'
	}

	function getThemeFromLocalStorage(): CodeViewerTheme {
		const theme = localStorage.getItem('code-viewer-theme');

		if (theme) {
			return theme as CodeViewerTheme;
		}

		return CodeViewerTheme.OceanDark;
	}

	export const codeViewerSettingsStore = writable<{
		fontSize: string;
		lineHeight: string;
		theme: CodeViewerTheme;
	}>(
		browser
			? {
					fontSize: localStorage.getItem('code-viewer-font-size') ?? '12',
					lineHeight: localStorage.getItem('code-viewer-line-height') ?? '1',
					theme: getThemeFromLocalStorage()
			  }
			: {
					fontSize: '12',
					lineHeight: '1',
					theme: CodeViewerTheme.OceanDark
			  }
	);

	export function setFontSize(fontSize: string) {
		localStorage.setItem('code-viewer-font-size', fontSize);
		codeViewerSettingsStore.update((s) => ({ ...s, fontSize }));
	}

	export function setLineHeight(lineHeight: string) {
		localStorage.setItem('code-viewer-line-height', lineHeight);
		codeViewerSettingsStore.update((s) => ({ ...s, lineHeight }));
	}

	export function setTheme(theme: CodeViewerTheme) {
		localStorage.setItem('code-viewer-theme', theme);
		codeViewerSettingsStore.update((s) => ({ ...s, theme }));
	}
</script>

<script lang="ts">
	import init, { highlight } from '@pedrozaalex/highlight-rs';
	import CodeViewerSettings from './CodeViewerSettings.svelte';
	import sanitize from 'sanitize-html';
	import { browser } from '$app/environment';

	export let code: string;
	export let filename: string;
	export let downloadUrl: string | undefined;

	$: language = filename.split('.').pop() ?? 'text';
	$: theme = $codeViewerSettingsStore.theme;
	$: highlightedCode = init().then(() => highlight(code, language, theme));
</script>

<div class="code-viewer-root">
	<div class="settings-overlay">
		<CodeViewerSettings />
	</div>

	{#await highlightedCode}
		<p>Highlighting code...</p>
	{:then highlighted}
		<div
			style="font-size: {$codeViewerSettingsStore.fontSize}px; line-height: {$codeViewerSettingsStore.lineHeight}em;"
		>
			{@html sanitize(highlighted, {
				allowedTags: ['pre', 'span'],
				allowedAttributes: {
					pre: ['style'],
					span: ['style']
				}
			})}
		</div>
	{:catch}
		<p>
			Can't display this file.
			{#if downloadUrl}
				<a href={downloadUrl} download={filename}>Download</a> it instead.
			{/if}
		</p>
	{/await}
</div>

<style lang="scss">
	.code-viewer-root {
		overflow: auto;
		position: relative;
	}

	.settings-overlay {
		position: fixed;
		top: 1rem;
		right: 1rem;
	}

	a {
		text-decoration: underline;

		&:hover {
			text-decoration: none;
		}
	}
</style>
