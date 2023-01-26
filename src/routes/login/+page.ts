import { redirect } from '@sveltejs/kit';
import { authStore } from '../../lib/stores/authStore';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	if (typeof window === 'undefined') return;

	const accessToken = url.searchParams.get('access_token');

	if (!accessToken) {
		return;
	}

	authStore.login(accessToken);

	localStorage.setItem('access_token', accessToken);

	throw redirect(302, '/search');
};
