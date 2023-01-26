export const github = {
	getOauthURL(clientId: string) {
		return `https://github.com/login/oauth/authorize?client_id=${clientId}`;
	},
	async getAccessToken(params: { clientId: string; clientSecret: string; code: string }) {
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
};
