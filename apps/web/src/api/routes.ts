export const API_ROUTES = {
	WORKFLOWS: {
		BASE: '/workflows',
		BY_ID: (id: string) => `/workflows/${id}`,
		SECRETS: (id: string) => `/workflows/${id}/secrets`,
		REVEAL_SECRET: (id: string, key: string) => `/workflows/${id}/secrets/${key}/reveal`,
		TRIGGER: (id: string) => `/workflows/${id}/trigger`,
		RUNS: (id: string) => `/workflows/${id}/runs`,
		GET_SPEC: (id: string) => `/workflows/${id}/spec`,
	},
	RUNS: {
		BASE: '/runs',
		RUN_LOGS: '/runs/runlogs',
	},
};
