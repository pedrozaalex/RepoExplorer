import initHighlighter from '@pedrozaalex/highlight-rs';
import * as wasm from '@pedrozaalex/highlight-rs';
import { formatDistance, parseISO } from 'date-fns';
import { pipe } from 'fp-ts/lib/function';
import md5 from 'md5';
import GitHubLanguageColors from 'github-colors';
import sanitize from 'sanitize-html';

export function getLanguageHSLColor(language: string) {
	const ghColor = GitHubLanguageColors[language]?.color;

	if (ghColor) {
		return darkenHSL(hexToHSL(ghColor), 10);
	}

	return stringToHSLColor(language);
}

function hexToHSL(H: string) {
	// Convert hex to RGB first
	let r: string | number = 0,
		g: string | number = 0,
		b: string | number = 0;
	if (H.length === 4) {
		r = '0x' + H[1] + H[1];
		g = '0x' + H[2] + H[2];
		b = '0x' + H[3] + H[3];
	} else if (H.length === 7) {
		r = '0x' + H[1] + H[2];
		g = '0x' + H[3] + H[4];
		b = '0x' + H[5] + H[6];
	}
	// Then to HSL
	r = (r as number) / 255;
	g = (g as number) / 255;
	b = (b as number) / 255;
	const cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin;
	let h = 0,
		s = 0,
		l = 0;

	if (delta === 0) h = 0;
	else if (cmax === r) h = ((g - b) / delta) % 6;
	else if (cmax === g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	if (h < 0) h += 360;

	l = (cmax + cmin) / 2;
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

export function stringToHSLColor(str: string) {
	const hex = '#' + md5(str).slice(3, 9);
	return hexToHSL(hex);
}

export function lightenHSL(hsl: string, percent = 40) {
	const [h, s, l] = hsl
		.replace('hsl(', '')
		.replace(')', '')
		.split(',')
		.map(x => parseInt(x));

	const newL = Math.min(100, l + percent);

	return `hsl(${h}, ${s}%, ${newL}%)`;
}

export function darkenHSL(hsl: string, percent = 60) {
	return lightenHSL(hsl, -percent);
}

const getDistanceFromNow = (date: Date) =>
	formatDistance(date, new Date(), {
		addSuffix: true
	});

/**
 * Calculates the last updated time from an ISO string
 * @param updatedAt ISO string
 * @returns string
 *
 * @example
 * calculateLastUpdatedFromISO('2020-10-01T00:00:00Z') // '2 days ago'
 */
export const calculateLastUpdatedFromISO = (updatedAt: string) =>
	pipe(
		updatedAt, // '2020-10-01T00:00:00Z'
		parseISO, // Date
		getDistanceFromNow // '2 days ago'
	);

export function ensureHasProtocol(url: string) {
	if (url.startsWith('https://') || url.startsWith('http://')) {
		return url;
	}

	return `https://${url}`;
}

export const EXT_TO_LANGUAGE = {
	js: 'javascript',
	jsx: 'javascript',
	ts: 'javascript',
	tsx: 'javascript',
	vue: 'javascript',
	css: 'css',
	scss: 'scss',
	sass: 'sass',
	html: 'html',
	json: 'json',
	md: 'txt',
	mdx: 'txt',
	yml: 'yaml',
	yaml: 'yaml',
	graphql: 'graphql',
	gql: 'graphql',
	txt: 'txt',
	sh: 'bash',
	py: 'python',
	rb: 'ruby',
	rs: 'rust',
	go: 'go',
	java: 'java',
	c: 'c',
	cpp: 'cpp',
	h: 'c',
	hpp: 'cpp',
	cs: 'csharp',
	swift: 'swift',
	kt: 'kotlin',
	php: 'php',
	lua: 'lua',
	r: 'r',
	dart: 'dart',
	sql: 'sql',
	hbs: 'handlebars',
	toml: 'toml',
	less: 'less',
	styl: 'stylus',
	svelte: 'javascript',
	elm: 'elm',
	pug: 'pug',
	diff: 'diff',
	config: 'txt',
	conf: 'txt',
	properties: 'txt',
	ini: 'txt',
	log: 'txt',
	lock: 'txt',
	markdown: 'markdown',
	csv: 'txt',
	tsv: 'txt',
	env: 'txt'
};

export function isBinaryData(data: string) {
	// eslint-disable-next-line no-control-regex
	const binaryRegex = /[\x00-\x08\x0E-\x1F\x7F-\x9F\uFFF0-\uFFFF]/;
	return binaryRegex.test(data);
}

export function extractPreTagStyle(html: string): string {
	const preTagRegex = /<pre.*?style="(.*?)".*?>/;
	const match = preTagRegex.exec(html);

	if (match) {
		return match[1];
	}

	return '';
}

export function tryHighlightStringAsHTML(code: string, language: string, theme: string) {
	return new Promise<string>((resolve, reject) => {
		initHighlighter()
			.then(() => {
				resolve(wasm.highlight(code, language, theme));
			})
			.catch(error => {
				console.error('An error occurred while highlighting code', error);
				reject(error);
			});
	});
}

export function isLineNotEmpty(line: string) {
	// remove all span tags and their attributes from the line
	return (
		line
			.replace(/<span.*?>/g, '')
			.replace(/<\/span>/g, '')
			.trim().length !== 0
	);
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function sanitizeHighlighterOutput(html: string) {
	return sanitize(html, { allowedTags: ['span'], allowedAttributes: { span: ['style'] } });
}
