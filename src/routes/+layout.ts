import { authStore } from '$lib/stores/authStore';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	if (typeof window === 'undefined') return;

	const accessToken = localStorage.getItem('access_token');

	if (!accessToken) {
		return;
	}

	authStore.login(accessToken);
};
