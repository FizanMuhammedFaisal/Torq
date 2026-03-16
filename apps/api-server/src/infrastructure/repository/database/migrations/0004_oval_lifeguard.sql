ALTER TABLE "workflow_version" ALTER COLUMN "version" SET DATA TYPE integer USING "version"::integer;--> statement-breakpoint
ALTER TABLE "workflow_version" ALTER COLUMN "spec" SET DATA TYPE json USING "spec"::json;--> statement-breakpoint
ALTER TABLE "workflow_version" ADD COLUMN "raw" text NOT NULL;