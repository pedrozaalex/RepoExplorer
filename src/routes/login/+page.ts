import { authStore } from '../../lib/stores/authStore';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	if (typeof window === 'undefined') return;

	const accessToken = url.searchParams.get('access_token');

	if (!accessToken) {
		return;
	}

	authStore.initialize(accessToken);

	localStorage.setItem('access_token', accessToken);

	window.location.href = '/';
};
