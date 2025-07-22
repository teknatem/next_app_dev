import { z } from 'zod';
import {
  MEETING_ASSET_KINDS,
  MeetingAssetKind,
  MEETING_ARTEFACT_TYPES,
  MeetingArtefactType,
  MEETING_ARTEFACT_STATUSES,
  MeetingArtefactStatus
} from './model/enums';

// Base TypeScript types (duplicated from ORM but client-safe)
export interface Meeting {
  id: string;
  title: string;
  startedAt: Date;
  endedAt: Date | null;
  location: string;
  isOnline: boolean;
  organiserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewMeeting {
  id?: string;
  title: string;
  startedAt: Date;
  endedAt?: Date | null;
  location: string;
  isOnline: boolean;
  organiserId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MeetingAsset {
  id: string;
  meetingId: string;
  kind: MeetingAssetKind;
  originalName: string;
  mimeType: string;
  storageUrl: string;
  metadata?: any;
  fileId: string | null;
}

export interface NewMeetingAsset {
  id?: string;
  meetingId: string;
  kind: MeetingAssetKind;
  originalName: string;
  mimeType: string;
  storageUrl: string;
  metadata?: any;
  fileId?: string | null;
}

export interface MeetingArtefact {
  id: string;
  assetId: string;
  artefactType: MeetingArtefactType;
  provider: string;
  language: string;
  version: number;
  status: MeetingArtefactStatus;
  payload?: any;
  result?: any;
  summary?: any;
  createdAt: Date;
  completedAt?: Date | null;
}

export interface NewMeetingArtefact {
  id?: string;
  assetId: string;
  artefactType: MeetingArtefactType;
  provider: string;
  language?: string;
  version?: number;
  status?: MeetingArtefactStatus;
  payload?: any;
  result?: any;
  summary?: any;
  createdAt?: Date;
  completedAt?: Date | null;
}

// Zod schemas for validation (client-safe)
export const insertMeetingSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  startedAt: z.date(),
  endedAt: z.date().nullable().optional(),
  location: z.string().optional().default(''),
  isOnline: z.boolean().optional().default(false),
  organiserId: z.string().uuid().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const selectMeetingSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  location: z.string(),
  isOnline: z.boolean(),
  organiserId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertMeetingAssetSchema = z.object({
  id: z.string().uuid().optional(),
  meetingId: z.string().uuid(),
  kind: z.enum(MEETING_ASSET_KINDS),
  originalName: z.string(),
  mimeType: z.string(),
  storageUrl: z.string(),
  metadata: z.any().optional(),
  fileId: z.string().uuid().nullable().optional()
});

export const selectMeetingAssetSchema = z.object({
  id: z.string().uuid(),
  meetingId: z.string().uuid(),
  kind: z.enum(MEETING_ASSET_KINDS),
  originalName: z.string(),
  mimeType: z.string(),
  storageUrl: z.string(),
  metadata: z.any().optional(),
  fileId: z.string().uuid().nullable()
});

export const insertMeetingArtefactSchema = z.object({
  id: z.string().uuid().optional(),
  assetId: z.string().uuid(),
  artefactType: z.enum(MEETING_ARTEFACT_TYPES),
  provider: z.string(),
  language: z.string().optional().default('en'),
  version: z.number().optional().default(1),
  status: z.enum(MEETING_ARTEFACT_STATUSES).optional().default('queued'),
  payload: z.any().optional(),
  result: z.any().optional(),
  summary: z.any().optional(),
  createdAt: z.date().optional(),
  completedAt: z.date().nullable().optional()
});

export const selectMeetingArtefactSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  artefactType: z.enum(MEETING_ARTEFACT_TYPES),
  provider: z.string(),
  language: z.string(),
  version: z.number(),
  status: z.enum(MEETING_ARTEFACT_STATUSES),
  payload: z.any().optional(),
  result: z.any().optional(),
  summary: z.any().optional(),
  createdAt: z.date(),
  completedAt: z.date().nullable()
});

// Additional schemas for business logic
export const meetingSearchSchema = z.object({
  query: z.string().optional(),
  isOnline: z.boolean().optional(),
  organiserId: z.string().uuid().optional(),
  startedAfter: z.string().datetime().optional(),
  startedBefore: z.string().datetime().optional()
});

export type MeetingSearch = z.infer<typeof meetingSearchSchema>;

export const meetingCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  location: z.string().min(1, 'Location is required'),
  isOnline: z.boolean(),
  organiserId: z.string().uuid().optional()
});

export type MeetingCreate = z.infer<typeof meetingCreateSchema>;

// Domain-specific types and schemas

// Meeting status enum
export const MeetingStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];

// Note: Asset kind, Artefact type, and Artefact status enums are imported from model/enums

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

// Extended types

// Asset with file information
export type MeetingAssetWithFileInfo = {
  id: string;
  meetingId: string;
  fileId: string | null;
  kind: MeetingAssetKind;
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
  kind: z.enum(MEETING_ASSET_KINDS),
  originalName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().positive()
});

export type AssetUploadData = z.infer<typeof assetUploadSchema>;

// AI processing request schema
export const aiProcessingRequestSchema = z.object({
  assetId: z.string().uuid(),
  artefactType: z.enum(MEETING_ARTEFACT_TYPES),
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
