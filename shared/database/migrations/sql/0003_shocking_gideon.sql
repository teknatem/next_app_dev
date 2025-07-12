CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"s3_key" varchar(1024) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"mime_type" varchar(127) NOT NULL,
	"file_size" integer NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "files_s3_key_unique" UNIQUE("s3_key")
);
