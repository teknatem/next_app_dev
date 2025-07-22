-- Rename d004 domain tables to follow memory-bank naming convention
-- meetings -> d004_meetings
-- meeting_assets -> d004_meeting_assets  
-- meeting_artefacts -> d004_meeting_artefacts

-- Rename tables
ALTER TABLE "meetings" RENAME TO "d004_meetings";
ALTER TABLE "meeting_assets" RENAME TO "d004_meeting_assets";
ALTER TABLE "meeting_artefacts" RENAME TO "d004_meeting_artefacts";

-- Update foreign key constraints
-- Drop old constraints
ALTER TABLE "d004_meeting_assets" DROP CONSTRAINT "meeting_assets_meeting_id_meetings_id_fk";
ALTER TABLE "d004_meeting_assets" DROP CONSTRAINT "meeting_assets_file_id_d002_files_id_fk";
ALTER TABLE "d004_meeting_artefacts" DROP CONSTRAINT "meeting_artefacts_asset_id_meeting_assets_id_fk";
ALTER TABLE "d004_meetings" DROP CONSTRAINT "meetings_organiser_id_employees_id_fk";

-- Add new constraints with updated table names
ALTER TABLE "d004_meeting_assets" ADD CONSTRAINT "d004_meeting_assets_meeting_id_d004_meetings_id_fk" 
  FOREIGN KEY ("meeting_id") REFERENCES "d004_meetings"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "d004_meeting_assets" ADD CONSTRAINT "d004_meeting_assets_file_id_d002_files_id_fk" 
  FOREIGN KEY ("file_id") REFERENCES "d002_files"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "d004_meeting_artefacts" ADD CONSTRAINT "d004_meeting_artefacts_asset_id_d004_meeting_assets_id_fk" 
  FOREIGN KEY ("asset_id") REFERENCES "d004_meeting_assets"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "d004_meetings" ADD CONSTRAINT "d004_meetings_organiser_id_d003_employees_id_fk" 
  FOREIGN KEY ("organiser_id") REFERENCES "d003_employees"("id") ON DELETE no action ON UPDATE no action;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_d004_meetings_organiser_id" ON "d004_meetings"("organiser_id");
CREATE INDEX IF NOT EXISTS "idx_d004_meetings_started_at" ON "d004_meetings"("started_at");
CREATE INDEX IF NOT EXISTS "idx_d004_meetings_created_at" ON "d004_meetings"("created_at");

CREATE INDEX IF NOT EXISTS "idx_d004_meeting_assets_meeting_id" ON "d004_meeting_assets"("meeting_id");
CREATE INDEX IF NOT EXISTS "idx_d004_meeting_assets_file_id" ON "d004_meeting_assets"("file_id");
CREATE INDEX IF NOT EXISTS "idx_d004_meeting_assets_kind" ON "d004_meeting_assets"("kind");

CREATE INDEX IF NOT EXISTS "idx_d004_meeting_artefacts_asset_id" ON "d004_meeting_artefacts"("asset_id");
CREATE INDEX IF NOT EXISTS "idx_d004_meeting_artefacts_artefact_type" ON "d004_meeting_artefacts"("artefact_type");
CREATE INDEX IF NOT EXISTS "idx_d004_meeting_artefacts_status" ON "d004_meeting_artefacts"("status");
CREATE INDEX IF NOT EXISTS "idx_d004_meeting_artefacts_created_at" ON "d004_meeting_artefacts"("created_at");

-- Add comments
COMMENT ON TABLE "d004_meetings" IS 'Встречи и совещания';
COMMENT ON TABLE "d004_meeting_assets" IS 'Файлы и медиа-материалы встреч';
COMMENT ON TABLE "d004_meeting_artefacts" IS 'AI-артефакты (транскрипции, диаризация)'; 