// logic validation for spec
// DAG Validation
// check if the depedecies mentioned exists, check if there are any self depedencies
// check if there are any cycles between depedencies

import { SemanticValidationError } from '@/domain/errors/semanticValidationError';
import type { ValidationIssue } from '../../types';
import { detectCycles } from '../common/detectCycles';
import type { WorkflowV1Alpha } from './schema';
// validate if the semantics of v1alpha is correct else throws semantics error
export function validateSemantics(spec: WorkflowV1Alpha) {
	const issues: ValidationIssue[] = [];
	const jobNames = new Set(Object.keys(spec.jobs));

	for (const [jobName, job] of Object.entries(spec.jobs)) {
		for (const dep of job.needs ?? []) {
			// check if the dep mentioned exists
			if (!jobNames.has(dep)) {
				issues.push({
					path: `jobs.${jobName}.needs`,
					message: `"${dep}" is not a defined job`,
				});
			}
			if (dep === jobName) {
				issues.push({
					path: `jobs.${jobName}.needs`,
					message: `"${dep}" cannot depend on itself`,
				});
			}
		}
	}

	const cycleNodes = detectCycles(spec.jobs);
	if (cycleNodes.length > 0) {
		issues.push({
			path: 'jobs',
			message: `Circular dependency detected involving: ${cycleNodes.join(', ')}`,
		});
	}
	if (issues.length > 0) {
		throw new SemanticValidationError('Semantic validation failed', issues);
	}
	return spec;
}
