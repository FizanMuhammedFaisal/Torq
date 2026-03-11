export const API_ROUTES = {
	WORKFLOWS: {
		BASE: '/api/workflows',
		BY_ID: (id: string) => `/api/workflows/${id}`,
		SECRETS: (id: string) => `/api/workflows/${id}/secrets`,
	},
};
