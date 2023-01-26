import { goto } from '$app/navigation';
import type { Endpoints } from '@octokit/types';
import { Octokit } from 'octokit';
import { get, writable } from 'svelte/store';

type UserData = Endpoints['GET /user']['response']['data'];

type LoggedOut = {
	isLoggedIn: false;
	user: null;
	octokit: null;
};

type LoggedIn = {
	isLoggedIn: true;
	user: Promise<UserData>;
	octokit: Octokit;
};

export type AuthStore = LoggedIn | LoggedOut;

const initialState: LoggedOut = {
	isLoggedIn: false,
	user: null,
	octokit: null
};

export const authStore = {
	...writable<AuthStore>(initialState),

	login(accessToken: string) {
		if (get(this).isLoggedIn) return;

		const octokit = new Octokit({ auth: accessToken });

		authStore.set({
			isLoggedIn: true,
			user: getUserData(octokit),
			octokit
		});
	},

	logout() {
		localStorage.removeItem('access_token');
		authStore.set(initialState);

		window.location.href = '/';
		goto('/');
	}
};

async function getUserData(octokit: Octokit) {
	try {
		const { data } = await octokit.rest.users.getAuthenticated();

		return data;
	} catch (e) {
		authStore.logout();
	}

	throw new Error('Failed to get user data');
}
