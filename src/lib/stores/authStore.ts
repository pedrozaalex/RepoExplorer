import type { Endpoints } from '@octokit/types';
import { Octokit } from 'octokit';
import { get, writable } from 'svelte/store';

type UserData = Endpoints['GET /user']['response']['data'];

type Unitialized = {
	initialized: false;
	isLoggedIn: false;
	user: null;
	octokit: null;
};

type InitializedLoggedOut = {
	initialized: true;
	isLoggedIn: false;
	user: null;
	octokit: null;
};

type InitializedLoggedIn = {
	initialized: true;
	isLoggedIn: true;
	user: Promise<UserData>;
	octokit: Octokit;
};

export type AuthStore = Unitialized | InitializedLoggedOut | InitializedLoggedIn;

export const authStore = {
	...writable<AuthStore>({
		initialized: false,
		isLoggedIn: false,
		user: null,
		octokit: null
	}),

	initialize(accessToken: string) {
		if (get(this).initialized) return;

		const octokit = new Octokit({ auth: accessToken });

		authStore.set({
			initialized: true,
			isLoggedIn: true,
			user: octokit.rest.users.getAuthenticated().then(({ data }) => data),
			octokit
		});
	},

	logout() {
		console.log('logging out');

		localStorage.removeItem('access_token');
		authStore.set({
			initialized: true,
			isLoggedIn: false,
			user: null,
			octokit: null
		});

		history.replaceState(null, '', '/');
		window.location.href = '/';
	}
};
