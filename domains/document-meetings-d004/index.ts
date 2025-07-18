// ✅ CLIENT-SAFE exports only

// Re-export shared types and schemas
export * from './model/meetings.schema';

// Export shared utilities
export * from './lib/date-utils';
export * from './lib/transcription-parser';

// Export UI components
export { MeetingList } from './ui/meeting.list.client';
export { MeetingDetails } from './ui/meeting.details.client';
export { MeetingPicker } from './ui/meeting.picker.client';
export { TranscriptionEditor } from './ui/transcription-editor.client';
