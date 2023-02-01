import { browser } from '$app/environment';
import type { Endpoints } from '@octokit/types';
import { createQuery } from '@tanstack/svelte-query';
import { number } from 'fp-ts';
import { filter, head, map, sort } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { getOrElseW } from 'fp-ts/lib/Option';
import { contramap, reverse } from 'fp-ts/lib/Ord';
import { toEntries } from 'fp-ts/lib/Record';
import { isString } from 'fp-ts/lib/string';
import { get } from 'svelte/store';
import type { StandardRepo } from '../components/Repository.svelte';
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

type MinimalRepo = Pick<
	Endpoints['GET /search/repositories']['response']['data']['items'][number],
	| 'description'
	| 'forks_count'
	| 'open_issues_count'
	| 'license'
	| 'name'
	| 'owner'
	| 'stargazers_count'
	| 'updated_at'
	| 'html_url'
	| 'homepage'
>;

function convertToStandardRepo(githubRepo: MinimalRepo): StandardRepo {
	return {
		description: githubRepo.description ?? 'No description',
		forks: githubRepo.forks_count,
		issues: githubRepo.open_issues_count,
		license: githubRepo.license?.name ?? 'No license',
		name: githubRepo.name,
		owner: githubRepo.owner?.login ?? 'ghost',
		stars: githubRepo.stargazers_count,
		updatedAt: githubRepo.updated_at,
		url: githubRepo.html_url,
		website: githubRepo.homepage
	};
}

export type SearchReposParams = {
	searchTerm?: string;
	page?: number;
	perPage?: number;
	sort?: 'stars' | 'recent';
	order?: 'desc' | 'asc';
};

export type SearchReposResponse = {
	items: StandardRepo[];
	totalItems: number;
	incompleteResults: boolean;
};

// export function searchRepos({
// 	searchTerm = '',
// 	page = 1,
// 	perPage = 10,
// 	sort = 'stars',
// 	order = 'desc'
// }: {
// 	searchTerm?: string;
// 	page?: number;
// 	perPage?: number;
// 	sort?: 'stars' | 'recent';
// 	order?: 'desc' | 'asc';
// }) {
// 	return createQuery({
// 		queryKey: ['searchRepos', searchTerm, page, perPage, sort, order],
// 		queryFn: async (): Promise<{
// 			items: StandardRepo[];
// 			totalItems: number;
// 			incompleteResults: boolean;
// 		}> => {
// 			if (!browser) return { items: [], totalItems: 0, incompleteResults: false };

// 			const octokit = get(authStore).octokit;

// 			if (!octokit) {
// 				throw new Error('Octokit not initialized');
// 			}

// 			console.log('searchRepos', searchTerm, page, perPage, sort, order);

// 			const { data } = await octokit.rest.search.repos({
// 				q: searchTerm,
// 				sort: sort === 'stars' ? 'stars' : 'updated',
// 				order,
// 				per_page: perPage,
// 				page
// 			});

// 			return {
// 				items: data.items.map(convertToStandardRepo),
// 				totalItems: data.total_count,
// 				incompleteResults: data.incomplete_results
// 			};
// 		}
// 	});
// }

export async function searchRepos({
	searchTerm = '',
	page = 1,
	perPage = 10,
	sort = 'stars',
	order = 'desc'
}: SearchReposParams) {
	if (!browser) return;

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
		totalItems: data.total_count,
		incompleteResults: data.incomplete_results
	};
}

const byLangUsage = pipe(
	reverse(number.Ord),
	contramap((lang: [string, number]) => lang[1])
);

const getOrderedLanguageList = (langs: { [key: string]: number }) =>
	pipe(
		langs, // {TypeScript: 500, JavaScript: 1000}
		toEntries, // [['TypeScript', 500], ['JavaScript', 1000]]
		sort(byLangUsage), // [['JavaScript', 1000], ['TypeScript', 500]]
		map(head), // [Some('JavaScript'), Some('TypeScript'), None]
		map(getOrElseW(() => '')), // ['JavaScript', 'TypeScript']
		filter(isString)
	);

export function getRepoLanguagues({ owner, name }: { owner: string; name: string }) {
	return createQuery({
		queryKey: ['languages', owner, name],
		queryFn: async (): Promise<string[]> => {
			if (!browser) return [];

			const octokit = get(authStore).octokit;

			if (!octokit) {
				console.error('Octokit not initialized');

				return [];
			}

			const { data: langs } = await octokit.rest.repos.listLanguages({ owner, repo: name });

			return getOrderedLanguageList(langs);
		}
	});
}

export function checkIfRepoIsStarred({ owner, name }: { owner: string; name: string }) {
	return createQuery({
		queryKey: ['starred', owner, name],
		queryFn: async (): Promise<boolean> => {
			if (!browser) return false;

			const octokit = get(authStore).octokit;

			if (!octokit) {
				console.error('Octokit not initialized');

				return false;
			}

			try {
				await octokit.rest.activity.getRepoSubscription({ owner, repo: name });

				return true;
			} catch (error) {
				console.log(`Repo ${owner}/${name} is not starred`);

				return false;
			}
		}
	});
}

type GetOneRepoParams = {
	owner: string;
	name: string;
};

export function getOneRepo({ owner, name }: GetOneRepoParams) {
	return createQuery({
		queryKey: ['repo', owner, name],
		queryFn: async (): Promise<StandardRepo | undefined> => {
			if (!browser) return;

			const octokit = get(authStore).octokit;

			if (!octokit) {
				console.error('Octokit not initialized');

				return;
			}

			const { data } = await octokit.rest.repos.get({ owner, repo: name });

			return convertToStandardRepo(data);
		}
	});
}
