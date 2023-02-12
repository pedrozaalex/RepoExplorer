<script lang="ts">
	import sanitize from 'sanitize-html';
	import { MAX_FONT_SIZE, MAX_LINE_HEIGHT, MIN_FONT_SIZE, MIN_LINE_HEIGHT } from '../constants';
	import { codeViewerSettingsStore } from '../stores/codeViewerSettingsStore';
	import {
		clamp,
		extractPreTagStyle,
		EXT_TO_LANGUAGE,
		sanitizeHighlighterOutput,
		tryHighlightStringAsHTML
	} from '../utils';
	import CodeViewerSettings from './CodeViewerSettings.svelte';

	export let code: string;
	export let filename: string;
	export let downloadUrl: string | undefined;

	$: fileExtension = filename.split('.').pop() ?? '';
	$: language = EXT_TO_LANGUAGE[fileExtension as keyof typeof EXT_TO_LANGUAGE] ?? 'txt';
	$: theme = $codeViewerSettingsStore.theme;

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

{@debug code}
{#await tryHighlightStringAsHTML(code, language, theme)}
	<p>Highlighting code...</p>
{:then highlighted}
	{@const lines = sanitizeHighlighterOutput(highlighted).split('\n').slice(1, -1)}
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
{:catch error}
	<div class="error">
		<p>
			Can't display this file.
			{#if downloadUrl}
				<a href={downloadUrl} download={filename}>Download</a> it instead.
			{/if}
		</p>

		<p class="error-message">{error.message ?? error}</p>
	</div>
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

		&::-webkit-scrollbar {
			display: none;
		}
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

	.error {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.error-message {
		color: red;
	}
</style>
