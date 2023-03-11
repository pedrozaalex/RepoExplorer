import { redirect, type RequestHandler } from '@sveltejs/kit';
import { GITHUB_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GITHUB_CLIENT_ID } from '$env/static/public';
import { getAccessToken } from '$lib/api/github';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw redirect(301, '/');
	}

	const accessToken = await getAccessToken({
		clientId: PUBLIC_GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET,
		code
	});

	throw redirect(301, `/login?access_token=${accessToken}`);
};
