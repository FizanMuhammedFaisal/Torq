import { pgTable, text, timestamp } from "drizzle-orm/pg-core";


export const workflowRunLog = pgTable('workflowRunLog', {
    id: text('id').primaryKey(),
    startedAt: timestamp('started_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
    status: text('status', { enum: ["PENDING", "RUNNING", "SUCCESS", "FAILED", "IDLE", "NOT_SUPPORTED_RUN"] })
})