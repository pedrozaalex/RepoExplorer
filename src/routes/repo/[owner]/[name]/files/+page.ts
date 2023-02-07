import type { PageLoad } from './$types';

export const load = (() => {
	return {
		selectedRepoTab: 'files'
	};
}) satisfies PageLoad;
