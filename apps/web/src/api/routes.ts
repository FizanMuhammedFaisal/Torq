export const API_ROUTES = {
	WORKFLOWS: {
		BASE: '/workflows',
		BY_ID: (id: string) => `/workflows/${id}`,
		SECRETS: (id: string) => `/workflows/${id}/secrets`,
	},
};
