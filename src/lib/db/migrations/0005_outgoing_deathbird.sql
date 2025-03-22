ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT '2025-03-21 07:38:38.256';--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "last_time" timestamp;