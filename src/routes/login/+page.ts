import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	if (typeof window === 'undefined') return;

	const accessToken = url.searchParams.get('access_token');

	if (!accessToken) {
		return;
	}

	localStorage.setItem('access_token', accessToken);

	throw redirect(302, '/search');
};
