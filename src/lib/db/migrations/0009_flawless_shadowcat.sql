ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT '2025-03-23 08:28:57.517';--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "priority";--> statement-breakpoint
DROP TYPE "public"."priority";