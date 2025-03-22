ALTER TABLE "task" ALTER COLUMN "slug" SET DEFAULT 'Task description';--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "created_at" SET DEFAULT '2025-03-19 13:09:27.224';