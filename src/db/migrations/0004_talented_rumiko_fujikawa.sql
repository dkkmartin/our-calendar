CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"userName" text NOT NULL,
	"endpoint" text NOT NULL,
	"expiration_time" text,
	"keys" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
