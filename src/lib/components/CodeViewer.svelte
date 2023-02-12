<script lang="ts">
	import { MAX_FONT_SIZE, MAX_LINE_HEIGHT, MIN_FONT_SIZE, MIN_LINE_HEIGHT } from '../constants';
	import { codeViewerSettingsStore } from '../stores/codeViewerSettingsStore';
	import {
		clamp,
		extractThemeBackground,
		EXT_TO_LANGUAGE,
		sanitizeHighlighterOutput,
		tryHighlightStringAsHTML,
		style,
		findLengthOfLargestLine
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
</script>

<CodeViewerSettings />

{#await tryHighlightStringAsHTML(code, language, theme)}
	<p>Highlighting code...</p>
{:then highlighted}
	{@const lines = sanitizeHighlighterOutput(highlighted).split('\n').slice(1, -1)}
	{@const containerStyles = style`
			--code-background-color: ${extractThemeBackground(highlighted)};
			--line-number-container-width: ${lines.length.toString().length}ch;
			--max-line-width: ${findLengthOfLargestLine(lines)}ch;
			--font-size: ${fontSize}px;
			--total-line-height: ${totalLineHeight}px;
			--total-code-height: ${(lines.length + 10) * totalLineHeight}px;
	`}

	<div class="code-container" style={containerStyles}>
		<pre>{#each lines as line}<code>{@html line}</code>{/each}</pre>
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

	.code-container {
		overflow: auto;
		height: 100%;
		width: 100%;
		position: relative;

		pre {
			background-color: var(--code-background-color);
			height: var(--total-code-height);
			display: flex;
			flex-direction: column;

			counter-reset: line;
		}
	}

	code {
		display: block;
		font-size: var(--font-size);
		font-family: var(--font-mono);
		height: var(--total-line-height);
		width: var(--max-line-width);

		counter-increment: line;

		&::before {
			content: counter(line);
			display: inline-block;
			text-align: right;
			color: #999;
			width: var(--line-number-container-width);
			margin-right: 2rem;
			background-color: var(--code-background-color);

			// make the line numbers stick to the left side of the container
			position: sticky;
			left: 0;
		}

		&:hover {
			background-color: #f5f5f5;

			&::before {
				background-color: #f5f5f5;
				font-weight: bolder;
			}
		}
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
