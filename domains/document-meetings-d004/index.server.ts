import 'server-only';

// ⚠️ SERVER-ONLY exports

// Re-export shared types and schemas
export * from './types.shared';

// Re-export enums and types
export * from './model/enums';

// Re-export ORM schemas (tables and relations only)
export {
  meetings,
  meetingAssets,
  meetingArtefacts,
  meetingsRelations,
  meetingAssetsRelations,
  meetingArtefactsRelations
} from './orm.server';

// Export shared utilities
export * from './lib/date-utils';

// Export server repository
export { meetingRepositoryServer } from './data/meeting.repo.server';

// Export server services
export { aiProcessingService } from './lib/ai-processing.server';

// Export server actions (orchestrators)
export {
  getMeetings as getMeetingsAction,
  searchMeetings as searchMeetingsAction,
  saveMeeting as saveMeetingAction,
  deleteMeeting as deleteMeetingAction,
  getMeetingById as getMeetingByIdAction,
  getAssetsByMeetingId as getAssetsByMeetingIdAction,
  createMeetingAsset as createMeetingAssetAction,
  deleteMeetingAsset as deleteMeetingAssetAction,
  getArtefactsByAssetId as getArtefactsByAssetIdAction,
  createTranscription as createTranscriptionAction,
  getArtefactById as getArtefactByIdAction,
  getArtefactsByMeetingId as getArtefactsByMeetingIdAction,
  deleteArtefact as deleteArtefactAction,
  getTranscriptionData as getTranscriptionDataAction,
  saveTranscription as saveTranscriptionAction
} from './features/crud.server';
