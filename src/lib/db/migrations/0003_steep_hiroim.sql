CREATE TYPE "public"."task_cadence" AS ENUM('day', 'week', 'month');--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT '2025-03-21 06:13:20.358';--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "cadence" "task_cadence";--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "last_generated_time" timestamp;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "recur_times" integer DEFAULT 0;