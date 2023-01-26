import continueIcon from '$images/continue.png';
import github from '$images/github.png';
import bigOctopus from '$images/big-octopus.png';

export const assets = {
	continue: continueIcon,
	github,
	bigOctopus
} as const;

export type Asset = keyof typeof assets;
