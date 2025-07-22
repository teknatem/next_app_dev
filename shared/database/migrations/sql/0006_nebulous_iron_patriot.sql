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
ALTER TABLE "meeting_artefacts" ADD CONSTRAINT "meeting_artefacts_asset_id_meeting_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."meeting_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_assets" ADD CONSTRAINT "meeting_assets_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_assets" ADD CONSTRAINT "meeting_assets_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_organiser_id_employees_id_fk" FOREIGN KEY ("organiser_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;