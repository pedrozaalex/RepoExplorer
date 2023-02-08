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
	import { browser } from '$app/environment';
	import init, { highlight } from '@pedrozaalex/highlight-rs';
	import sanitize from 'sanitize-html';
	import { extractPreTagStyle, EXT_TO_LANGUAGE, isBinaryData } from '../utils';
	import CodeViewerSettings from './CodeViewerSettings.svelte';

	export let code: string;
	export let filename: string;
	export let downloadUrl: string | undefined;

	$: fileExtension = filename.split('.').pop() ?? '';
	$: language =
		fileExtension in EXT_TO_LANGUAGE
			? EXT_TO_LANGUAGE[fileExtension as keyof typeof EXT_TO_LANGUAGE]
			: 'txt';
	$: theme = $codeViewerSettingsStore.theme;
	$: highlightedCode = new Promise<string>((resolve, reject) => {
		if (isBinaryData(code)) {
			reject();
		}

		init()
			.then(() => {
				resolve(highlight(code, language, theme));
			})
			.catch((e) => {
				reject(e);
			});
	});
</script>

<div class="code-viewer-root">
	<div class="settings-overlay">
		<CodeViewerSettings />
	</div>

	{#await highlightedCode}
		<p>Highlighting code...</p>
	{:then highlighted}
		{@const lines = sanitize(highlighted, {
			allowedTags: ['span'],
			allowedAttributes: { span: ['style'] }
		})
			.split('\n')
			.slice(1, -1)}
		{@const heightVars = `
				--code-viewer-font-size: ${$codeViewerSettingsStore.fontSize}px;
				--code-viewer-line-height: ${$codeViewerSettingsStore.lineHeight};
			`}

		<div class="code-viewer-content-container" style={heightVars}>
			<div class="code-viewer-line-numbers-container">
				{#each lines as _, i}
					<div class="code-viewer-line-number">{i + 1}</div>
				{/each}
			</div>
			<pre
				class="code-viewer-content"
				style={extractPreTagStyle(highlighted)}>{#each lines as line}<div class="code-line"><code
							>{@html line}</code
						></div>{/each}</pre>
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
		position: relative;
		max-height: 100%;
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

	.code-viewer-content-container {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
	}

	.code-viewer-line-numbers-container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-end;
		padding-right: 0.5rem;
	}

	.code-viewer-line-number {
		color: gray;
		user-select: none;
		text-align: right;
		display: inline-block;
		font-family: var(--font-mono);
		font-size: var(--code-viewer-font-size);
		height: calc(var(--code-viewer-line-height) * var(--code-viewer-font-size));
	}

	.code-viewer-content {
		.code-line {
			user-select: text;
			font-size: var(--code-viewer-font-size);
			height: calc(var(--code-viewer-line-height) * var(--code-viewer-font-size));

			&:hover {
				background-color: rgba(0, 0, 0, 0.2);
			}
		}

		code {
			height: calc(var(--code-viewer-line-height) * var(--code-viewer-font-size));
			font-family: var(--font-mono);
			display: inline-block;
		}
	}
</style>
