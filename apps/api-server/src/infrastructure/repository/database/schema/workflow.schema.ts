import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, integer, json } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const workflow = pgTable('workflow', {
	id: text('id').primaryKey(),
	identityId: text('identity_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workflowVersion = pgTable('workflow_version', {
	id: text('id').primaryKey().notNull(),
	workflowId: text('workflow_id')
		.notNull()
		.references(() => workflow.id),
	version: integer('version').notNull(),
	raw: text('raw').notNull(),
	spec: json('spec').$type<Record<string, unknown>>().notNull(),
	troqVersion: text('torq_version').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const secrets = pgTable('secret', {
	id: text('id').primaryKey().notNull(),
	workflowId: text('workflow_id')
		.notNull()
		.references(() => workflow.id),
	key: text('key').notNull(),
	ciphertext: text('ciphertext').notNull(),
	iv: text('iv').notNull(),
	tag: text('tag').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const workflowRelations = relations(workflow, ({ one, many }) => ({
	user: one(user, {
		fields: [workflow.identityId],
		references: [user.id],
	}),
	versions: many(workflowVersion),
	secrets: many(secrets),
	runs: many(workflowRun),
}));


export const workflowVersionRelations = relations(workflowVersion, ({ one }) => ({
	workflow: one(workflow, {
		fields: [workflowVersion.workflowId],
		references: [workflow.id],
	}),
}));

export const secretRelations = relations(secrets, ({ one }) => ({
	workflow: one(workflow, {
		fields: [secrets.workflowId],
		references: [workflow.id],
	}),
}));

// Workflow runs
export const workflowRun = pgTable('workflow_run', {
	id: text('id').primaryKey(),
	workflowId: text('workflow_id')
		.notNull()
		.references(() => workflow.id),
	workflowVersionId: text('workflow_version_id')
		.notNull()
		.references(() => workflowVersion.id),
	status: text('status', { enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'IDLE', "NOT_SUPPORTED_RUN"] }).notNull(),
	triggerType: text('trigger_type', { enum: ['MANUAL', 'WEBHOOK', 'SCHEDULE'] }).notNull(),
	triggeredBy: text('triggered_by').notNull(),
	startedAt: timestamp('started_at').defaultNow().notNull(),
	completedAt: timestamp('completed_at'),
	duration: integer('duration'),
});

export const workflowRunRelations = relations(workflowRun, ({ one }) => ({
	workflow: one(workflow, {
		fields: [workflowRun.workflowId],
		references: [workflow.id],
	}),
}));