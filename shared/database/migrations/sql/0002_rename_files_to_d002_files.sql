-- Rename files table to d002_files
ALTER TABLE "files" RENAME TO "d002_files";

-- Add new required fields
ALTER TABLE "d002_files" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;
ALTER TABLE "d002_files" ADD COLUMN "created_by" uuid REFERENCES "users"("id");
ALTER TABLE "d002_files" ADD COLUMN "updated_by" uuid REFERENCES "users"("id");
ALTER TABLE "d002_files" ADD COLUMN "deleted_at" timestamp with time zone;
ALTER TABLE "d002_files" ADD COLUMN "deleted_by" uuid REFERENCES "users"("id");
ALTER TABLE "d002_files" ADD COLUMN "metadata" text;

-- Update foreign key constraint name
ALTER TABLE "meeting_assets" DROP CONSTRAINT "meeting_assets_file_id_files_id_fk";
ALTER TABLE "meeting_assets" ADD CONSTRAINT "meeting_assets_file_id_d002_files_id_fk" 
  FOREIGN KEY ("file_id") REFERENCES "d002_files"("id") ON DELETE no action ON UPDATE no action; 