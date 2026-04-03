import type { V1CustomResourceDefinition } from '@kubernetes/client-node';

export const CRD_NAME = 'workflowruns.torq.dev';
export const CRD_DEFINITION: V1CustomResourceDefinition = {
	apiVersion: 'apiextensions.k8s.io/v1',
	kind: 'CustomResourceDefinition',
	metadata: {
		name: CRD_NAME,
	},
	spec: {
		group: 'torq.dev',
		scope: 'Namespaced',
		names: {
			plural: 'workflowruns',
			singular: 'workflowrun',
			kind: 'WorkflowRun',
			shortNames: ['wr'],
			categories: ['torq'],
		},
		versions: [
			{
				name: 'v1alpha1',
				served: true,
				storage: true,

				subresources: {
					status: {},
				},

				additionalPrinterColumns: [
					{ name: 'Phase', type: 'string', jsonPath: '.status.phase' },
					{ name: 'Workflow', type: 'string', jsonPath: '.spec.workflowId' },
					{ name: 'Version', type: 'string', jsonPath: '.spec.torqVersion' },
					{ name: 'Triggered by', type: 'string', jsonPath: '.spec.triggeredBy' },
					{ name: 'Age', type: 'date', jsonPath: '.metadata.creationTimestamp' },
				],

				schema: {
					openAPIV3Schema: {
						type: 'object',
						properties: {
							spec: {
								type: 'object',
								required: ['workflowId', 'versionId', 'torqVersion'],
								properties: {
									workflowId: { type: 'string' },
									versionId: { type: 'string' },
									torqVersion: { type: 'string', _enum: ['v1alpha'] },
									triggerType: { type: 'string' },
									createdAt: { type: 'string', format: 'date-time' },
									// inputs: {
									// 	type: 'object',
									// 	x_kubernetes_preserve_unknown_fields: true,
									// },
								},
							},
							status: {
								type: 'object',
								x_kubernetes_preserve_unknown_fields: true,
							},
						},
					},
				},
			},
		],
	},
};
