import { goto } from '$app/navigation';
import { Octokit } from 'octokit';
import { get, writable } from 'svelte/store';

export type User = {
	username: string;
	picture: string;
};

type LoggedOut = {
	isLoggedIn: false;
	user: null;
	octokit: null;
};

type LoggedIn = {
	isLoggedIn: true;
	user: Promise<User>;
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
		console.log('authStore.login: begin');

		if (get(this).isLoggedIn) return;

		console.log('authStore.login: creating new Octokit instance');

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

		goto('/');
	}
};

async function getUserData(octokit: Octokit) {
	try {
		const {
			data: { login: username, avatar_url: picture }
		} = await octokit.rest.users.getAuthenticated();

		return {
			username,
			picture
		};
	} catch (e) {
		authStore.logout();
		console.error(e);
		throw new Error('Failed to get user data');
	}
}
