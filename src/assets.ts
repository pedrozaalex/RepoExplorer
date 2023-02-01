import continueIcon from '$images/continue.png';
import github from '$images/github.svg';
import bigOctopus from '$images/big-octopus.png';
import tinyOctopus from '$images/tiny-octopus.png';
import magnifyingGlass from '$images/magnifying-glass.png';
import star from '$images/star.png';
import fork from '$images/fork.png';
import warning from '$images/warning.png';
import arrowRight from '$images/arrow-right.svg';
import arrowLeft from '$images/arrow-left.svg';
import globe from '$images/globe.svg';
import maximize from '$images/maximize.svg';

export const assets = {
	bigOctopus,
	fork,
	continue: continueIcon,
	github,
	magnifyingGlass,
	star,
	tinyOctopus,
	warning,
	arrowRight,
	arrowLeft,
	globe,
	maximize
} as const;

export type Asset = keyof typeof assets;
