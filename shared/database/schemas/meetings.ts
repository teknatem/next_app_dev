// Re-export meetings domain ORM schemas and types (server-only)
/*export {
  meetings,
  meetingAssets,
  meetingArtefacts,
  meetingsRelations,
  meetingAssetsRelations,
  meetingArtefactsRelations
} from '@/domains/document-meetings-d004/orm.server';
*/

// Re-export types from types.shared (client-safe)
export type {
  Meeting,
  NewMeeting,
  MeetingAsset,
  NewMeetingAsset,
  MeetingArtefact,
  NewMeetingArtefact,
  MeetingSearch,
  MeetingCreate
} from '@/domains/document-meetings-d004/types.shared';

// Re-export Zod schemas from types.shared (client-safe)
export {
  insertMeetingSchema,
  selectMeetingSchema,
  insertMeetingAssetSchema,
  selectMeetingAssetSchema,
  insertMeetingArtefactSchema,
  selectMeetingArtefactSchema,
  meetingSearchSchema,
  meetingCreateSchema
} from '@/domains/document-meetings-d004/types.shared';
