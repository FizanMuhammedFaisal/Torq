import type { ApiextensionsV1ApiCreateCustomResourceDefinitionRequest } from '@kubernetes/client-node';

export const CRDName = 'workflows.torq.dev';
export const CRD_DEFINITION: ApiextensionsV1ApiCreateCustomResourceDefinitionRequest = {
	body: {
		apiVersion: 'apiextensions.k8s.io/v1',
		kind: 'CustomResourceDefinition',
		metadata: {
			name: CRDName,
		},
		spec: {
			group: 'torq.dev',
			versions: [
				{
					name: 'v1',
					served: true,
					storage: true,
					schema: {
						openAPIV3Schema: {
							type: 'object',
							properties: {
								spec: {
									type: 'object',
									properties: {
										workflowId: {
											type: 'string',
										},
										workflowName: {
											type: 'string',
										},
										workflowVersion: {
											type: 'string',
										},
										workflowDescription: {
											type: 'string',
										},
										workflowStatus: {
											type: 'string',
										},
										workflowCreated: {
											type: 'string',
										},
										workflowUpdated: {
											type: 'string',
										},
										workflowDeleted: {
											type: 'string',
										},
									},
								},
							},
						},
					},
				},
			],
			scope: 'Namespaced',
			names: {
				plural: 'workflows',
				singular: 'workflow',
				kind: 'Workflow',
				shortNames: ['wf'],
			},
		},
	},
};
