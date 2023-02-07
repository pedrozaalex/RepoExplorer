import type { LayoutLoad } from './$types';

export const load = (({ params }) => {
	return {
		owner: params.owner,
		name: params.name
	};
}) satisfies LayoutLoad;
