<script lang="ts" context="module">
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

	export const MIN_FONT_SIZE = 12;
	export const MAX_FONT_SIZE = 24;
	export const MIN_LINE_HEIGHT = 1.4;
	export const MAX_LINE_HEIGHT = 3;

	function getThemeFromLocalStorage(): CodeViewerTheme {
		const theme = localStorage.getItem('code-viewer-theme');

		if (theme !== null && Object.values(CodeViewerTheme).includes(theme as CodeViewerTheme)) {
			return theme as CodeViewerTheme;
		}

		return CodeViewerTheme.InspiredGitHub;
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
	import sanitize from 'sanitize-html';
	import { clamp, extractPreTagStyle, EXT_TO_LANGUAGE, tryHighlightStringAsHTML } from '../utils';
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
	$: highlightedCode = tryHighlightStringAsHTML(code, language, theme);

	$: fontSize = clamp(parseFloat($codeViewerSettingsStore.fontSize), MIN_FONT_SIZE, MAX_FONT_SIZE);
	$: lineHeight = clamp(
		parseFloat($codeViewerSettingsStore.lineHeight),
		MIN_LINE_HEIGHT,
		MAX_LINE_HEIGHT
	);
	$: totalLineHeight = fontSize * lineHeight;

	let lineBeingHovered: number | undefined;
	function makeMouseEnterHandlerForLine(lineNumber: number) {
		return () => {
			lineBeingHovered = lineNumber;
		};
	}
	function mouseLeaveHandler() {
		lineBeingHovered = undefined;
	}

	let lineNumbersContainer: HTMLDivElement;

	// codeContainer is a <code> tag
	let codeContainer: HTMLPreElement;

	function syncLineNumbersWithCode() {
		// Prevents the code container from scrolling past the line numbers container
		// since they can be of slightly different heights
		const lineNumberContainerMaxScrollTop =
			lineNumbersContainer.scrollHeight - lineNumbersContainer.clientHeight;

		const isAtBottom = codeContainer.scrollTop > lineNumberContainerMaxScrollTop;

		if (isAtBottom) {
			codeContainer.scrollTop = lineNumberContainerMaxScrollTop;
		} else {
			lineNumbersContainer.scrollTop = codeContainer.scrollTop;
		}
	}
</script>

<CodeViewerSettings />

{#await highlightedCode}
	<p>Highlighting code...</p>
{:then highlighted}
	{@const lines = sanitize(highlighted, {
		allowedTags: ['span'],
		allowedAttributes: { span: ['style'] }
	})
		.split('\n')
		.slice(1, -1)}
	{@const containerStyles = `
			${extractPreTagStyle(highlighted)}
			--line-number-container-width: ${lines.length.toString().length + 1}ch;
			--font-size: ${fontSize}px;
			--total-line-height: ${totalLineHeight}px;
		`}

	<div class="content-container" style={containerStyles}>
		<div class="line-numbers-container" bind:this={lineNumbersContainer}>
			{#each lines as _, i}
				<div class="line-number" class:accentuated={i === lineBeingHovered}>
					{i + 1}
				</div>
			{/each}
		</div>

		<div class="content">
			<pre
				on:scroll={syncLineNumbersWithCode}
				bind:this={codeContainer}>{#each lines as line, i}<code
						on:mouseenter={makeMouseEnterHandlerForLine(i)}
						on:mouseleave={mouseLeaveHandler}>{@html line}</code
					>{/each}</pre>
		</div>
	</div>
{:catch}
	<p>
		Can't display this file.
		{#if downloadUrl}
			<a href={downloadUrl} download={filename}>Download</a> it instead.
		{/if}
	</p>
{/await}

<style lang="scss">
	@import '../mixins.scss';

	a {
		text-decoration: underline;

		&:hover {
			text-decoration: none;
		}
	}

	.content-container {
		flex-direction: row;
		overflow: hidden;
		position: relative;
		height: 100%;
		width: 100%;
	}

	.line-numbers-container {
		overflow-y: auto;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}

	.line-number {
		position: relative;
		color: gray;
		user-select: none;
		font-family: var(--font-mono);
		font-size: var(--font-size);
		height: var(--total-line-height);
		padding: 0 0.5rem;

		&.accentuated {
			font-weight: bold;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.content {
		overflow: hidden;
		height: 100%;
		width: calc(100% - var(--line-number-container-width) - 1rem);
		position: absolute;
		top: 0;
		right: 0;

		pre {
			overflow: auto;
			position: relative;
			height: 100%;
		}
	}

	code {
		font-size: var(--font-size);
		height: var(--total-line-height);
		font-family: var(--font-mono);
		display: block;
	}
</style>
