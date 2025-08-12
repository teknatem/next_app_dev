-- Drop cross-aggregate foreign keys to align with DDD boundaries
-- d004_meeting_assets.file_id -> d002_files.id
-- d004_meetings.organiser_id -> d003_employees.id

-- New constraint names after table rename
ALTER TABLE "d004_meeting_assets" DROP CONSTRAINT IF EXISTS "d004_meeting_assets_file_id_d002_files_id_fk";
ALTER TABLE "d004_meetings" DROP CONSTRAINT IF EXISTS "d004_meetings_organiser_id_d003_employees_id_fk";

-- Legacy constraint names (pre-rename safety)
ALTER TABLE "meeting_assets" DROP CONSTRAINT IF EXISTS "meeting_assets_file_id_d002_files_id_fk";
ALTER TABLE "meeting_assets" DROP CONSTRAINT IF EXISTS "meeting_assets_file_id_files_id_fk";
ALTER TABLE "meetings" DROP CONSTRAINT IF EXISTS "meetings_organiser_id_employees_id_fk";

-- Note: Keeping intra-aggregate FKs intact:
--   d004_meeting_assets.meeting_id -> d004_meetings.id
--   d004_meeting_artefacts.asset_id -> d004_meeting_assets.id


