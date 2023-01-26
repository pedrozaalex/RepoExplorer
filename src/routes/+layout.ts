import { authStore } from '$lib/stores/authStore';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	if (typeof window === 'undefined') return;

	const accessToken = localStorage.getItem('access_token');

	if (!accessToken) {
		return;
	}

	authStore.login(accessToken);
};
