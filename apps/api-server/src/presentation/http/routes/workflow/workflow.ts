import Elysia from 'elysia';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowController } from '@/presentation/http/interfaces/controller/workflow.interface';
import type { Router } from '@/presentation/http/interfaces/routes';
import { CreateWorkflowSchema } from '@/application/dto/worflows/createWorkflow.dto';
import {
	UpsertSecretsQuerySchema,
	UpsertSecretsSchema,
} from '@/application/dto/worflows/upsertSecrets.dto';
import { TriggerWorkflowRunSchema } from '@/application/dto/worflows/triggerWorkflowRun.dto';
import { GetSecretsSchema } from '@/application/dto/worflows/getSecrets.dto';
import { RevealSecretSchema } from '@/application/dto/worflows/revealSecret.dto';
import type { AuthMacro } from '@/presentation/http/macros/auth.macro';
import { GetWorkflowsInputSchema } from '@/application/dto/worflows/getWorkflows.dto';
import {
	GetWorkflowByIdInputParamsSchema,
	GetWorkflowByIdInputQuerySchema,
} from '@/application/dto/worflows/getWorkflowById.dto';

@injectable()
export class WorkflowRouter implements Router {
	readonly prefix = '/workflows';

	constructor(
		@inject(TOKENS.WorkflowController)
		private workflowController: IWorkflowController,
		@inject(TOKENS.AuthMacro)
		private authMacro: AuthMacro,
	) {}

	register() {
		return new Elysia({ prefix: this.prefix })
			.use(this.create())
			.use(this.list())
			.use(this.upsertSecrets())
			.use(this.getSecrets())
			.use(this.trigger())
			.use(this.revealSecret())
			.use(this.getById());
	}

	getById() {
		return new Elysia().use(this.authMacro.plugin()).get(
			'/:id',
			(ctx) => {
				return this.workflowController.getWorkflowById(ctx);
			},
			{
				auth: true,
				query: GetWorkflowByIdInputQuerySchema,
				params: GetWorkflowByIdInputParamsSchema,
			},
		);
	}

	create() {
		return new Elysia().use(this.authMacro.plugin()).post(
			'/',
			(ctx) => {
				return this.workflowController.createWorkflow(ctx);
			},
			{
				body: CreateWorkflowSchema,
				auth: true,
			},
		);
	}

	list() {
		return new Elysia().use(this.authMacro.plugin()).get(
			'/',
			(ctx) => {
				return this.workflowController.getWorkflows(ctx);
			},
			{
				auth: true,
			},
		);
	}

	upsertSecrets() {
		return new Elysia().use(this.authMacro.plugin()).post(
			'/:id/secrets',
			(ctx) => {
				return this.workflowController.upsertSecrets(ctx);
			},
			{
				params: UpsertSecretsQuerySchema,
				body: UpsertSecretsSchema,
				auth: true,
			},
		);
	}

	getSecrets() {
		return new Elysia().use(this.authMacro.plugin()).get(
			'/:id/secrets',
			(ctx) => {
				return this.workflowController.getSecrets(ctx);
			},
			{
				params: GetSecretsSchema,
				auth: true,
			},
		);
	}

	trigger() {
		return new Elysia().use(this.authMacro.plugin()).post(
			'/:id/trigger',
			(ctx) => {
				return this.workflowController.triggerWorkflowRun(ctx);
			},
			{
				body: TriggerWorkflowRunSchema,
				auth: true,
			},
		);
	}

	revealSecret() {
		return new Elysia().use(this.authMacro.plugin()).get(
			'/:id/secrets/:key/reveal',
			(ctx) => {
				return this.workflowController.revealSecret(ctx);
			},
			{
				params: RevealSecretSchema,
				auth: true,
			},
		);
	}
}
