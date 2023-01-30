import continueIcon from '$images/continue.png';
import github from '$images/github.png';
import bigOctopus from '$images/big-octopus.png';
import tinyOctopus from '$images/tiny-octopus.png';
import magnifyingGlass from '$images/magnifying-glass.png';
import star from '$images/star.png';
import fork from '$images/fork.png';
import warning from '$images/warning.png';

export const assets = {
	bigOctopus,
	fork,
	continue: continueIcon,
	github,
	magnifyingGlass,
	star,
	tinyOctopus,
	warning
} as const;

export type Asset = keyof typeof assets;
