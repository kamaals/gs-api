ALTER TABLE "task" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT '2025-03-23 05:29:56.415';