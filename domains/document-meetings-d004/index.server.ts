import 'server-only';

// ⚠️ SERVER-ONLY exports

// Re-export shared types and schemas
export * from './model/meetings.schema';

// Export shared utilities
export * from './lib/date-utils';

// Export server repository
export { meetingRepositoryServer } from './data/meeting.repo.server';

// Export server services
export { aiProcessingService } from './lib/ai-processing.server';

// Export server actions
export {
  getMeetingsAction,
  searchMeetingsAction,
  saveMeetingAction,
  deleteMeetingAction,
  getMeetingByIdAction,
  getAssetsByMeetingIdAction,
  createMeetingAssetAction,
  deleteMeetingAssetAction
} from './actions/crud.actions.server';
