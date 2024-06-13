CREATE TABLE IF NOT EXISTS "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"date" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
