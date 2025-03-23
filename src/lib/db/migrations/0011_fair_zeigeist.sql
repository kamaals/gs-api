ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT '2025-03-23 08:30:19.255';--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "priority" integer DEFAULT 0;