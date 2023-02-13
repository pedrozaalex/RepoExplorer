import initHighlighter, * as wasm from 'pyranine';
import { formatDistance, parseISO } from 'date-fns';
import { pipe } from 'fp-ts/lib/function';
import sanitize from 'sanitize-html';

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

export function extractThemeBackground(html: string): string {
	const preTagRegex = /<pre.*?style="background-color:(.*?);">/;
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

// Simply remove any whitespace from the string
export function style(strings: TemplateStringsArray, ...values: (string | number)[]) {
	let output = '';
	strings.forEach((str, i) => {
		output += str;
		if (values[i]) {
			output += values[i];
		}
	});
	return output.replace(/\s+/g, ' ');
}

/**
 * Extracts the text from a line of code outputted by the highlighter
 * @param line A line of code outputted by the highlighter, it contains <span> tags with inline styles
 * @returns The line of code without any <span> tags
 */
function getCodeLineLength(line: string) {
	return line.replace(/<span.*?>/g, '').replace(/<\/span>/g, '').length;
}

export function findLengthOfLargestLine(lines: string[]) {
	return lines
		.map(getCodeLineLength) // Calculate the length of each line discarding the <span> tags content
		.reduce((a, b) => Math.max(a, b), 0);
}
