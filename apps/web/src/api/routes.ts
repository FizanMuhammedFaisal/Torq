export const API_ROUTES = {
	WORKFLOWS: {
		BASE: '/workflows',
		BY_ID: (id: string) => `/workflows/${id}`,
		SECRETS: (id: string) => `/workflows/${id}/secrets`,
		REVEAL_SECRET: (id: string, key: string) => `/workflows/${id}/secrets/${key}/reveal`,
		TRIGGER: (id: string) => `/workflows/${id}/trigger`,
		RUNS: (id: string) => `/workflows/${id}/runs`,
	},
	RUNS: {
		BASE: '/runs',
	},
};
