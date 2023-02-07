<script lang="ts" context="module">
	export enum CodeViewerTheme {
		GitHub = 'github',
		AtomOneLight = 'atom-one-light',
		AtomOneDark = 'atom-one-dark',
		Dracula = 'dracula',
		Outrun = 'outrun-dark'
	}

	let selectedTheme = CodeViewerTheme.GitHub;

	const getThemeData = (theme: CodeViewerTheme) => {
		switch (theme) {
			case CodeViewerTheme.GitHub:
				return import('svelte-highlight/styles/github');
			case CodeViewerTheme.AtomOneLight:
				return import('svelte-highlight/styles/atom-one-light');
			case CodeViewerTheme.AtomOneDark:
				return import('svelte-highlight/styles/atom-one-dark');
			case CodeViewerTheme.Dracula:
				return import('svelte-highlight/styles/dracula');
			case CodeViewerTheme.Outrun:
				return import('svelte-highlight/styles/outrun-dark');
		}
	};

	export function setTheme(theme: CodeViewerTheme) {
		selectedTheme = theme;
	}

</script>

<script lang="ts">
	import { HighlightAuto } from 'svelte-highlight';
	import CodeViewerSettings from './CodeViewerSettings.svelte';

	export let code: string;
</script>

<svelte:head>
	{@html getThemeData(selectedTheme)}
</svelte:head>

<div class="code-viewer-root">
	<div class="settings-overlay">
		<CodeViewerSettings />
	</div>

	<HighlightAuto {code} />
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
</style>
