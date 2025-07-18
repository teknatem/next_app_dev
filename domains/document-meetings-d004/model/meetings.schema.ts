// Re-export shared database schemas
export {
  meetings,
  meetingAssets,
  meetingArtefacts,
  meetingsRelations,
  meetingAssetsRelations,
  meetingArtefactsRelations,
  insertMeetingSchema,
  selectMeetingSchema,
  insertMeetingAssetSchema,
  selectMeetingAssetSchema,
  insertMeetingArtefactSchema,
  selectMeetingArtefactSchema,
  meetingSearchSchema,
  meetingCreateSchema,
  type Meeting,
  type NewMeeting,
  type MeetingAsset,
  type NewMeetingAsset,
  type MeetingArtefact,
  type NewMeetingArtefact,
  type MeetingSearch,
  type MeetingCreate
} from '../../../shared/database/schemas/meetings';

// Domain-specific types and schemas
import { z } from 'zod';

// Meeting status enum
export const MeetingStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];

// Asset kind enum
export const AssetKind = {
  DOCUMENT: 'document',
  AUDIO: 'audio',
  VIDEO: 'video'
} as const;

export type AssetKind = (typeof AssetKind)[keyof typeof AssetKind];

// Artefact type enum
export const ArtefactType = {
  TRANSCRIPT: 'transcript',
  DIARISATION: 'diarisation'
} as const;

export type ArtefactType = (typeof ArtefactType)[keyof typeof ArtefactType];

// Artefact status enum
export const ArtefactStatus = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  DONE: 'done',
  ERROR: 'error'
} as const;

export type ArtefactStatus =
  (typeof ArtefactStatus)[keyof typeof ArtefactStatus];

// Extended meeting schema with status
export const meetingWithStatusSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().nullable(),
  location: z.string(),
  isOnline: z.boolean(),
  organiserId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: z.nativeEnum(MeetingStatus),
  assetCount: z.number().optional(),
  artefactCount: z.number().optional()
});

export type MeetingWithStatus = z.infer<typeof meetingWithStatusSchema>;

// Meeting with statistics (extend the Meeting type from shared schemas)
export type MeetingWithStats = {
  id: string;
  title: string;
  startedAt: Date;
  endedAt: Date | null;
  location: string;
  isOnline: boolean;
  organiserId: string | null;
  createdAt: Date;
  updatedAt: Date;
  assetCount: number;
  artefactCount: number;
};

// Asset with file information
export type MeetingAssetWithFileInfo = {
  id: string;
  meetingId: string;
  fileId: string | null;
  kind: string;
  originalName: string;
  mimeType: string;
  storageUrl: string;
  // File information
  fileTitle: string;
  fileDescription: string | null;
  fileSize: number;
};

// Meeting creation form schema
export const meetingFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  location: z.string().min(1, 'Location is required'),
  isOnline: z.boolean(),
  organiserId: z.string().uuid().optional(),
  description: z.string().optional()
});

export type MeetingFormData = z.infer<typeof meetingFormSchema>;

// Asset upload schema
export const assetUploadSchema = z.object({
  meetingId: z.string().uuid(),
  kind: z.nativeEnum(AssetKind),
  originalName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().positive()
});

export type AssetUploadData = z.infer<typeof assetUploadSchema>;

// AI processing request schema
export const aiProcessingRequestSchema = z.object({
  assetId: z.string().uuid(),
  artefactType: z.nativeEnum(ArtefactType),
  provider: z.string(),
  language: z.string().default('en'),
  options: z.record(z.any()).optional()
});

export type AIProcessingRequest = z.infer<typeof aiProcessingRequestSchema>;

// Types for transcription editor widget
export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  duration: number;
  speaker: string;
  text: string;
}

export interface TranscriptionResult {
  segments: TranscriptionSegment[];
  metadata?: {
    totalDuration?: number;
    speakerCount?: number;
    provider?: string;
    language?: string;
  };
}

export interface TranscriptionPayload {
  text?: string;
  confidence?: number;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  paragraphs?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    words: Array<{
      text: string;
      start: number;
      end: number;
      confidence: number;
    }>;
  }>;
  metadata?: {
    provider?: string;
    language?: string;
    transcriptId?: string;
  };
}

export interface TranscriptionEditorData {
  payload: TranscriptionPayload;
  result: TranscriptionResult | null;
  summary: string;
}

// Schema for saving transcription data
export const saveTranscriptionSchema = z.object({
  artefactId: z.string().uuid(),
  result: z.object({
    segments: z.array(
      z.object({
        id: z.string(),
        start: z.number(),
        end: z.number(),
        duration: z.number(),
        speaker: z.string(),
        text: z.string()
      })
    ),
    metadata: z
      .object({
        totalDuration: z.number().optional(),
        speakerCount: z.number().optional(),
        provider: z.string().optional(),
        language: z.string().optional()
      })
      .optional()
  }),
  summary: z.string()
});

export type SaveTranscriptionData = z.infer<typeof saveTranscriptionSchema>;
