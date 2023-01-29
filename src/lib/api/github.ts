import { browser } from '$app/environment';
import type { Endpoints } from '@octokit/types';
import { createQuery } from '@tanstack/svelte-query';
import { get } from 'svelte/store';
import type { StandardRepo } from '../components/Repo.svelte';
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

function convertToStandardRepo(
	githubRepo: Endpoints['GET /search/repositories']['response']['data']['items'][number]
): StandardRepo {
	return {
		fullName: githubRepo.full_name,
		description: githubRepo.description ?? 'No description',
		stars: githubRepo.stargazers_count,
		issues: githubRepo.open_issues_count,
		forks: githubRepo.forks_count,
		url: githubRepo.html_url,
		lastUpdated: githubRepo.updated_at,
		license: githubRepo.license?.name ?? 'No license'
	};
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
		queryFn: async (): Promise<{
			items: StandardRepo[];
			totalCount: number;
			incompleteResults: boolean;
		}> => {
			if (!browser) return { items: [], totalCount: 0, incompleteResults: false };

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

			return {
				items: data.items.map(convertToStandardRepo),
				totalCount: data.total_count,
				incompleteResults: data.incomplete_results
			};
		}
	});
}
