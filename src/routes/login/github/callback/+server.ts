import { redirect, type RequestHandler } from '@sveltejs/kit';

import { GITHUB_CLIENT_SECRET as clientSecret } from '$env/static/private';
import { PUBLIC_GITHUB_CLIENT_ID as clientId } from '$env/static/public';
import { github } from '$lib/github';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw redirect(301, '/');
	}

	const accessToken = await github.getAccessToken({ clientId, clientSecret, code });

	throw redirect(301, `/login?access_token=${accessToken}`);
};
