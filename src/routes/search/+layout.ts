import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ url, params }) => {
	return {
		searchTerm: params.searchTerm,
		page: Number(url.searchParams.get('page')) || 1,
		sort: url.searchParams.get('sort') || 'stars'
	};
};
