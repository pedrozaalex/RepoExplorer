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
	import {
		extractPreTagStyle,
		EXT_TO_LANGUAGE,
		isLineNotEmpty,
		tryHighlightStringAsHTML
	} from '../utils';
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
	function syncLineNumbersContainerScroll(e: Event) {
		lineNumbersContainer.scrollTop = (e.target as HTMLDivElement).scrollTop;
	}
</script>

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
	{@const containerStyles = `
			${extractPreTagStyle(highlighted)}
			--line-number-container-width: ${lines.length.toString().length + 2}ch;
			--code-viewer-font-size: ${$codeViewerSettingsStore.fontSize}px;
			--code-viewer-line-height: ${$codeViewerSettingsStore.lineHeight};
		`}

	<div class="code-viewer-content-container" style={containerStyles}>
		<div class="code-viewer-line-numbers-container" bind:this={lineNumbersContainer}>
			{#each lines as _, i}
				<div class="code-viewer-line-number" class:accentuated={i === lineBeingHovered}>
					{i + 1}
				</div>
			{/each}
		</div>

		<div class="code-viewer-content">
			<pre on:scroll={syncLineNumbersContainerScroll}>{#each lines as line, i}<code
						on:mouseenter={makeMouseEnterHandlerForLine(i)}
						on:mouseleave={mouseLeaveHandler}>{@html line}</code
					><!-- <button
						class="copy-button"
						style:display={isLineNotEmpty(line) && lineBeingHovered === i ? 'block' : 'none'}
						><iconify-icon icon="material-symbols:content-copy" /></button
					> -->{/each}</pre>
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

	.settings-overlay {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 10;
	}

	a {
		text-decoration: underline;

		&:hover {
			text-decoration: none;
		}
	}

	.code-viewer-content-container {
		flex-direction: row;
		overflow: hidden;
		position: relative;
		height: 100%;
		width: 100%;
		// display: flex;
	}

	.code-viewer-line-numbers-container {
		overflow-y: auto;
		// @include hide-scrollbar;
		height: 100%;
		// width: 7.5%;
		width: 100%;
		// padding-right: 1rem;
		// transform: translateX(-95%);
	}

	.code-viewer-line-number {
		color: gray;
		user-select: none;
		font-family: var(--font-mono);
		font-size: var(--code-viewer-font-size);
		height: calc(var(--code-viewer-line-height) * var(--code-viewer-font-size));

		&.accentuated {
			font-weight: bold;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.code-viewer-content {
		overflow: hidden;
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		left: var(--line-number-container-width);

		pre {
			overflow: auto;
			position: relative;
			height: 100%;
		}
	}

	// .code-line {
	// 	position: relative;
	// 	font-size: var(--code-viewer-font-size);
	// 	height: calc(var(--code-viewer-line-height) * var(--code-viewer-font-size));

	// 	&:hover {
	// 		background-color: rgba(0, 0, 0, 0.2);
	// 	}
	// }

	code {
		height: calc(var(--code-viewer-line-height) * var(--code-viewer-font-size));
		font-family: var(--font-mono);
		display: block;
	}

	.copy-button {
		position: absolute;
		width: 1.5rem;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
		cursor: pointer;
	}
</style>
