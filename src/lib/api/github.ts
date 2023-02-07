import { browser } from '$app/environment';
import { VERCEL_URL } from '$env/static/public';
import { ensureHasProtocol } from '$lib/utils';
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
import type { StandardRepo } from '../components/RepositoryCard.svelte';
import { authStore } from '../stores/authStore';

function getOctokitInstance() {
	const { octokit } = get(authStore);

	if (!octokit) throw new Error('Octokit not initialized');

	return octokit;
}

export function getOauthAuthorizeURL(clientId: string) {
	const url = ensureHasProtocol(VERCEL_URL);
	return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${url}/login/github/callback`;
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

export function convertToStandardRepo(githubRepo: MinimalRepo): StandardRepo {
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

export type SearchReposResponse = Promise<{
	items: StandardRepo[];
	totalItems: number;
	incompleteResults: boolean;
}>;

export function searchRepos({
	searchTerm = '',
	page = 1,
	perPage = 10,
	sort = 'stars',
	order = 'desc'
}: SearchReposParams) {
	return createQuery({
		queryKey: ['searchRepos', searchTerm, page, perPage, sort, order],
		queryFn: async (): SearchReposResponse => {
			if (!browser) return { items: [], totalItems: 0, incompleteResults: false };

			const octokit = getOctokitInstance();

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
	});
}

const byLangUsage = pipe(
	reverse(number.Ord),
	contramap((lang: [string, number]) => lang[1])
);

const orderLanguageList = (langs: { [key: string]: number }) =>
	pipe(
		langs, // {TypeScript: 500, JavaScript: 1000}
		toEntries, // [['TypeScript', 500], ['JavaScript', 1000]]
		sort(byLangUsage), // [['JavaScript', 1000], ['TypeScript', 500]]
		map(head), // [Some('JavaScript'), Some('TypeScript'), None]
		map(getOrElseW(() => null)), // ['JavaScript', 'TypeScript']
		filter(isString)
	);

type BaseRepoParams = {
	owner: string;
	name: string;
};

type GetRepoLanguagesParams = BaseRepoParams;
type GetRepoLanguagesResponse = Promise<string[]>;

export function getRepoLanguagues({ owner, name }: GetRepoLanguagesParams) {
	return createQuery({
		queryKey: ['languages', owner, name],
		queryFn: async (): GetRepoLanguagesResponse => {
			if (!browser) return [];

			const octokit = getOctokitInstance();

			const { data: langs } = await octokit.rest.repos.listLanguages({ owner, repo: name });

			return orderLanguageList(langs);
		}
	});
}

type CheckIfRepoIsStarredParams = BaseRepoParams;
type CheckIfRepoIsStarredResponse = Promise<boolean>;

export function checkIfRepoIsStarred({ owner, name }: CheckIfRepoIsStarredParams) {
	return createQuery({
		queryKey: ['starred', owner, name],
		queryFn: async (): CheckIfRepoIsStarredResponse => {
			if (!browser) return false;

			const octokit = getOctokitInstance();

			try {
				await octokit.rest.activity.getRepoSubscription({ owner, repo: name });

				return true;
			} catch (error) {
				return false;
			}
		}
	});
}

type GetOneRepoParams = BaseRepoParams;

type GetOneRepoResponse = Promise<StandardRepo | undefined>;

export function getOneRepo({ owner, name }: GetOneRepoParams) {
	return createQuery({
		queryKey: ['repo', owner, name],
		queryFn: async (): GetOneRepoResponse => {
			if (!browser) return undefined;

			const octokit = getOctokitInstance();

			const { data } = await octokit.rest.repos.get({ owner, repo: name });

			return convertToStandardRepo(data);
		}
	});
}

type GetRepoReadmeParams = BaseRepoParams;
type GetRepoReadmeResponse = Promise<string | null>;

export function getRepoReadme({ owner, name }: GetRepoReadmeParams) {
	return createQuery({
		queryKey: ['readme', owner, name],
		queryFn: async (): GetRepoReadmeResponse => {
			if (!browser) return null;

			const octokit = getOctokitInstance();

			try {
				const { data } = await octokit.rest.repos.getReadme({
					owner,
					repo: name,
					mediaType: { format: 'html' }
				});

				return data as unknown as string;
			} catch (error) {
				console.error('Error getting readme', error);
				return null;
			}
		}
	});
}

type GetRepoContentsParams = BaseRepoParams & {
	path: string;
};
type StandardRepoContents = {
	name: string;
	path: string;
	type: 'file' | 'dir' | 'symlink' | 'submodule';
	content?: string;
};
type GetRepoContentsResponse = Promise<StandardRepoContents[]>;

export function getRepoContents({ owner, name, path }: GetRepoContentsParams) {
	return createQuery({
		queryKey: ['contents', owner, name, path],
		queryFn: async (): GetRepoContentsResponse => {
			if (!browser) return [];

			const octokit = getOctokitInstance();

			try {
				const { data } = await octokit.rest.repos.getContent({
					owner,
					repo: name,
					path
				});

				switch (typeof data) {
					case 'object':
						if (Array.isArray(data)) {
							return data.map((item) => ({
								name: item.name,
								path: item.path,
								type: item.type,
								content: item.type === 'file' ? item.content : undefined
							}));
						}

						return [
							{
								name: data.name,
								path: data.path,
								type: data.type
							}
						];
					default:
						return [];
				}
			} catch (error) {
				console.error('Error getting contents', error);
				return [];
			}
		}
	});
}
