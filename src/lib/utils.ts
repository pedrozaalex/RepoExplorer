import { formatDistance, parseISO } from 'date-fns';
import { pipe } from 'fp-ts/lib/function';

export function stringToColour(str: string) {
	if (str.length === 0) {
		return 'hsl(0, 0, 100%)';
	} else {
		const sanitized = str.replace(/[^A-Za-z]/, '');
		const letters = sanitized.split('');

		//Determine the hue
		let hue = Math.floor(((letters[0].toLowerCase().charCodeAt(0) - 96) / 26) * 360);
		let ord = 0;
		for (const i in letters) {
			ord = letters[i].charCodeAt(0);
			if ((ord >= 65 && ord <= 90) || (ord >= 97 && ord <= 122)) {
				hue += ord - 64;
			}
		}

		hue = hue % 360;

		//Determine the saturation
		const vowels = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u'];
		let count_cons = 0;

		//Count the consonants
		for (const i in letters) {
			if (vowels.indexOf(letters[i]) == -1) {
				count_cons++;
			}
		}

		//Determine what percentage of the string is consonants and weight to 95% being fully saturated.
		let saturation = (count_cons / letters.length / 0.95) * 100;
		if (saturation > 100) saturation = 100;

		//Determine the luminosity
		const ascenders = ['t', 'd', 'b', 'l', 'f', 'h', 'k'];
		const descenders = ['q', 'y', 'p', 'g', 'j'];
		let luminosity = 50;
		const increment = (1 / letters.length) * 50;

		for (const i in letters) {
			if (ascenders.indexOf(letters[i]) != -1) {
				luminosity += increment;
			} else if (descenders.indexOf(letters[i]) != -1) {
				luminosity -= increment * 2;
			}
		}

		luminosity = luminosity * 0.5;

		return `hsl(${hue}, ${saturation}%, ${luminosity}%)`;
	}
}

export function lightenHSL(hsl: string, percent = 60) {
	const [h, s, l] = hsl
		.replace('hsl(', '')
		.replace(')', '')
		.split(',')
		.map((x) => parseInt(x));

	const newL = Math.min(100, l + percent);

	return `hsl(${h}, ${s}%, ${newL}%)`;
}

const getDistanceFromNow = (date: Date) =>
	formatDistance(date, new Date(), {
		addSuffix: true
	});

export const calculateLastUpdated = (updatedAt: string) =>
	pipe(
		updatedAt, // '2020-10-01T00:00:00Z'
		parseISO, // Date
		getDistanceFromNow // '2 days ago'
	);
