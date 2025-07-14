DROP TABLE IF EXISTS "llm_chats" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "llm_chat_messages" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "meeting_artefacts" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "meeting_assets" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "meetings" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "production_items_consumption" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "production_items" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "users" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "employees" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "files" CASCADE;
--> statement-breakpoint
CREATE TABLE "llm_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"message_count" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"total_cost" numeric(10, 6) DEFAULT '0',
	"default_model" varchar(50) DEFAULT 'gpt-3.5-turbo',
	"system_prompt" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "llm_chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"model" varchar(50),
	"provider" varchar(20) DEFAULT 'openai',
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"total_tokens" integer,
	"cost" numeric(10, 6),
	"finish_reason" varchar(50),
	"response_time" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meeting_artefacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"artefact_type" text NOT NULL,
	"provider" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "meeting_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"storage_url" text NOT NULL,
	"metadata" jsonb,
	"file_id" uuid
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone,
	"location" text NOT NULL,
	"is_online" boolean NOT NULL,
	"organiser_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_items_consumption" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"item_name" text NOT NULL,
	"item_code" text,
	"item_article" text,
	"receipt_doc" text NOT NULL,
	"receipt_date" date NOT NULL,
	"production_date" date NOT NULL,
	"quantity" numeric(15, 3) NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"article" text,
	"type" text DEFAULT 'material' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "production_items_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"password_hash" varchar(255) NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"position" text NOT NULL,
	"department" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
--> statement-breakpoint
ALTER TABLE "meeting_artefacts" ADD CONSTRAINT "meeting_artefacts_asset_id_meeting_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."meeting_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_assets" ADD CONSTRAINT "meeting_assets_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_assets" ADD CONSTRAINT "meeting_assets_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_organiser_id_employees_id_fk" FOREIGN KEY ("organiser_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_items_consumption" ADD CONSTRAINT "production_items_consumption_item_id_production_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."production_items"("id") ON DELETE no action ON UPDATE no action;