import type { PageLoad } from './$types';

export const load = (({ url }) => {
	return {
		selectedRepoTab: 'files',
		openFilePath: url.searchParams.get('path')
	};
}) satisfies PageLoad;
