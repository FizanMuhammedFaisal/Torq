import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const workflowRunLog = pgTable('workflowRunLog', {
	id: text('id').primaryKey(),
	workflowRunId: text('workflow_run_id'),
	status: text('status', {
		enum: ['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'IDLE', 'NOT_SUPPORTED_RUN'],
	}),
	logTime: timestamp('log_time').defaultNow(),
});
