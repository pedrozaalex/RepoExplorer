import type { PageLoad } from './$types';

export const load = (() => {
	return {
		selectedRepoTab: 'stats'
	};
}) satisfies PageLoad;
