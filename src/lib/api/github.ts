import { browser } from '$app/environment';
import { createQuery } from '@tanstack/svelte-query';
import { get } from 'svelte/store';
import { authStore } from '../stores/authStore';

export function getOauthAuthorizeURL(clientId: string) {
	return `https://github.com/login/oauth/authorize?client_id=${clientId}`;
}

export async function getAccessToken(params: {
	clientId: string;
	clientSecret: string;
	code: string;
}) {
	const { clientId, clientSecret, code } = params;

	const res = await fetch(
		`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json'
			}
		}
	);

	const data = await res.json();

	const { access_token } = data;

	return access_token;
}

export function searchRepos({
	searchTerm,
	page = 1,
	perPage = 10,
	sort = 'stars',
	order = 'desc'
}: {
	searchTerm: string;
	page?: number;
	perPage?: number;
	sort?: 'stars' | 'recent';
	order?: 'desc' | 'asc';
}) {
	return createQuery({
		queryKey: ['searchRepos', searchTerm, page],
		queryFn: async () => {
			if (!browser) return { items: [], total_count: 0, incomplete_results: false };

			const octokit = get(authStore).octokit;

			if (!octokit) {
				throw new Error('Octokit not initialized');
			}

			const { data } = await octokit.rest.search.repos({
				q: searchTerm,
				sort: sort === 'stars' ? 'stars' : 'updated',
				order,
				per_page: perPage,
				page
			});
			return data;
		}
	});
}
