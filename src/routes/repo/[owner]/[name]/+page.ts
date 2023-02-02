import { getOneRepo } from '$lib/api/github';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
	return {
		owner: params.owner,
		name: params.name
	}
}) satisfies PageLoad;
