CREATE TABLE IF NOT EXISTS "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"date" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
