ALTER TABLE "workflow" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_run" ADD COLUMN "workflow_version_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_run" ADD COLUMN "trigger_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_run" ADD COLUMN "triggered_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_version" ADD COLUMN "torq_version" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_run" ADD CONSTRAINT "workflow_run_workflow_version_id_workflow_version_id_fk" FOREIGN KEY ("workflow_version_id") REFERENCES "public"."workflow_version"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_run" DROP COLUMN "steps";