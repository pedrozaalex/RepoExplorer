import type { PageLoad } from './$types';

export const load = (() => {
	return {
		selectedRepoTab: 'about'
	};
}) satisfies PageLoad;
