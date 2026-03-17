import { SchemaValidationError } from '@/domain/errors/schemaValidationError';
import type { ValidationIssue } from '../../types';
import { isKebabCase, isNonEmptyString, isObject, isValidEnvKey } from '../common/base';
import { version, type WorkflowV1Alpha } from './schema';

export function validate(raw: unknown): WorkflowV1Alpha {
	const issues: ValidationIssue[] = [];

	if (!isObject(raw)) {
		throw new SchemaValidationError('Document must be an object', []);
	}

	//version
	if (raw.version !== version) {
		throw new SchemaValidationError('Invalid version', []);
	}
	if (!isNonEmptyString(raw.workflow)) {
		issues.push({ path: 'workflow', message: 'workflow name is required' });
	} else if (!isKebabCase(raw.workflow as string)) {
		issues.push({
			path: 'workflow',
			message: 'workflow name must be lowercase kebab-case e.g. my-workflow',
		});
	}
	//jobs
	if (!isObject(raw.jobs)) {
		issues.push({ path: 'jobs', message: 'jobs must be an object' });
	} else if (Object.keys(raw.jobs).length === 0) {
		issues.push({ path: 'jobs', message: 'at least one job is required' });
	} else {
		for (const [jobName, job] of Object.entries(raw.jobs)) {
			if (!isKebabCase(jobName)) {
				issues.push({
					path: `jobs.${jobName}`,
					message: `Job name "${jobName}" must be lowercase kebab-case`,
				});
			}
			issues.push(...validateJob(job, `jobs.${jobName}`));
		}
	}
	if (issues.length > 0) {
		throw new SchemaValidationError('Schema validation failed', issues);
	}
	return raw as unknown as WorkflowV1Alpha;
}
// schema methords

function validateStep(step: unknown, path: string): ValidationIssue[] {
	//eg  { "run": "./deploy.sh" }
	const issues: ValidationIssue[] = [];
	if (!isObject(step)) {
		return [{ path, message: 'Step must be an object' }];
	}
	if (!isNonEmptyString(step.run)) {
		issues.push({ path: `${path}.run`, message: 'run is required and must be a non-empty string' });
	}
	return issues;
}
function validateSecretRef(secret: unknown, path: string): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	if (!isObject(secret)) {
		return [{ path, message: 'Secret must be an object' }];
	}
	if (!isNonEmptyString(secret.name)) {
		issues.push({ path: `${path}.name`, message: 'name is required' });
	}

	if (!isNonEmptyString(secret.env)) {
		issues.push({ path: `${path}.env`, message: 'env is required' });
	} else if (!isValidEnvKey(secret.env)) {
		issues.push({ path: `${path}.env`, message: 'env must be uppercase e.g. NPM_TOKEN' });
	}

	return issues;
}
function validateJob(job: unknown, path: string): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	if (!isObject(job)) {
		return [{ path, message: 'Job must be an object' }];
	}

	// image
	if (!isNonEmptyString(job.image)) {
		issues.push({ path: `${path}.image`, message: 'image is required e.g. node:20' });
	}
	// needs
	if (job.needs !== undefined) {
		if (!Array.isArray(job.needs)) {
			issues.push({ path: `${path}.needs`, message: 'needs must be an array' });
		} else {
			job.needs.forEach((dep, i) => {
				if (!isNonEmptyString(dep)) {
					issues.push({ path: `${path}.needs[${i}]`, message: 'Must be a non-empty string' });
				}
			});
		}
	}
	// env
	if (job.env !== undefined) {
		if (!isObject(job.env)) {
			issues.push({ path: `${path}.env`, message: 'env must be a key-value object' });
		} else {
			for (const [key, val] of Object.entries(job.env)) {
				if (typeof val !== 'string') {
					issues.push({ path: `${path}.env.${key}`, message: 'env values must be strings' });
				}
			}
		}
	}
	//secrects
	if (job.secrets !== undefined) {
		if (!Array.isArray(job.secrets)) {
			issues.push({ path: `${path}.secrets`, message: 'secrets must be an array' });
		} else {
			job.secrets.forEach((secret, i) => {
				issues.push(...validateSecretRef(secret, `${path}.secrets[${i}]`));
			});
		}
	}

	// steps
	if (!Array.isArray(job.steps) || job.steps.length === 0) {
		issues.push({
			path: `${path}.steps`,
			message: 'steps is required and must have at least one step',
		});
	} else {
		job.steps.forEach((step, i) => {
			issues.push(...validateStep(step, `${path}.steps[${i}]`));
		});
	}
	return issues;
}
