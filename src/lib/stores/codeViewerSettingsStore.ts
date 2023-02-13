import { browser } from '$app/environment';
import { get, readable } from 'svelte/store';

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

const getSettingsStoreInitialStateClientSide = () => ({
	fontSize: localStorage.getItem('code-viewer-font-size') ?? '12',
	lineHeight: localStorage.getItem('code-viewer-line-height') ?? '1',
	theme: getThemeFromLocalStorage()
});

const getSettingsStoreInitialStateServerSide = () => ({
	fontSize: '12',
	lineHeight: '1',
	theme: CodeViewerTheme.InspiredGitHub
});

let setSettingsStore: (value: {
	fontSize: string;
	lineHeight: string;
	theme: CodeViewerTheme;
}) => void;

const codeViewerSettingsStore = readable<{
	fontSize: string;
	lineHeight: string;
	theme: CodeViewerTheme;
}>(
	browser ? getSettingsStoreInitialStateClientSide() : getSettingsStoreInitialStateServerSide(),
	function start(set) {
		setSettingsStore = set;
	}
);

function setFontSize(fontSize: string) {
	localStorage.setItem('code-viewer-font-size', fontSize);
	const oldSettings = get(codeViewerSettingsStore);

	setSettingsStore({
		...oldSettings,
		fontSize
	});
}

function setLineHeight(lineHeight: string) {
	localStorage.setItem('code-viewer-line-height', lineHeight);
	const oldSettings = get(codeViewerSettingsStore);

	setSettingsStore({
		...oldSettings,
		lineHeight
	});
}

function setTheme(theme: CodeViewerTheme) {
	localStorage.setItem('code-viewer-theme', theme);
	const oldSettings = get(codeViewerSettingsStore);

	setSettingsStore({
		...oldSettings,
		theme
	});
}

export { codeViewerSettingsStore, setFontSize, setLineHeight, setTheme };
