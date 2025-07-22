// Meeting asset kinds
export const MEETING_ASSET_KINDS = ['document', 'audio', 'video'] as const;
export type MeetingAssetKind = (typeof MEETING_ASSET_KINDS)[number];

// Meeting artefact types
export const MEETING_ARTEFACT_TYPES = ['transcript', 'diarisation'] as const;
export type MeetingArtefactType = (typeof MEETING_ARTEFACT_TYPES)[number];

// Meeting artefact statuses
export const MEETING_ARTEFACT_STATUSES = [
  'queued',
  'processing',
  'done',
  'error'
] as const;
export type MeetingArtefactStatus = (typeof MEETING_ARTEFACT_STATUSES)[number];
