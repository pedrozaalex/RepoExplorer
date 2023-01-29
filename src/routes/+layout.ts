import { browser } from '$app/environment';
import { authStore } from '$lib/stores/authStore';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => {
	if (!browser) return;

	const accessToken = localStorage.getItem('access_token');

	if (!accessToken) {
		return;
	}

	authStore.login(accessToken);
};
