import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { employees } from '../../../domains/catalog-employees-d003/model/employees.schema';
import { relations } from 'drizzle-orm';
import { d002Files } from '@/domains/catalog-files-d002/model/files.schema';

// Main meetings table
export const meetings = pgTable('meetings', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  location: text('location').notNull(),
  isOnline: boolean('is_online').notNull(),
  organiserId: uuid('organiser_id').references(() => employees.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

// Meeting assets (files and media)
export const meetingAssets = pgTable('meeting_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: uuid('meeting_id')
    .references(() => meetings.id, { onDelete: 'cascade' })
    .notNull(),
  kind: text('kind', {
    enum: ['document', 'audio', 'video']
  }).notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  storageUrl: text('storage_url').notNull(),
  metadata: jsonb('metadata'),
  fileId: uuid('file_id').references(() => d002Files.id)
});

// AI artefacts (transcripts & diarisation)
export const meetingArtefacts = pgTable('meeting_artefacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id')
    .references(() => meetingAssets.id, { onDelete: 'cascade' })
    .notNull(),
  artefactType: text('artefact_type', {
    enum: ['transcript', 'diarisation']
  }).notNull(),
  provider: text('provider').notNull(),
  language: text('language').default('en').notNull(),
  version: integer('version').default(1).notNull(),
  status: text('status', {
    enum: ['queued', 'processing', 'done', 'error']
  })
    .notNull()
    .default('queued'),
  payload: jsonb('payload').$type<any>(),
  result: jsonb('result').$type<any>(),
  summary: jsonb('summary').$type<any>(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true })
});

// Relations
export const meetingsRelations = relations(meetings, ({ many, one }) => ({
  assets: many(meetingAssets),
  organiser: one(employees, {
    fields: [meetings.organiserId],
    references: [employees.id]
  })
}));

export const meetingAssetsRelations = relations(
  meetingAssets,
  ({ one, many }) => ({
    meeting: one(meetings, {
      fields: [meetingAssets.meetingId],
      references: [meetings.id]
    }),
    file: one(d002Files, {
      fields: [meetingAssets.fileId],
      references: [d002Files.id]
    }),
    artefacts: many(meetingArtefacts)
  })
);

export const meetingArtefactsRelations = relations(
  meetingArtefacts,
  ({ one }) => ({
    asset: one(meetingAssets, {
      fields: [meetingArtefacts.assetId],
      references: [meetingAssets.id]
    })
  })
);

// Zod schemas for validation
export const insertMeetingSchema = createInsertSchema(meetings, {
  id: (schema) => schema.id.optional(),
  location: (schema) => schema.location.optional().default(''),
  isOnline: (schema) => schema.isOnline.optional().default(false)
});
export const selectMeetingSchema = createSelectSchema(meetings);

export const insertMeetingAssetSchema = createInsertSchema(meetingAssets);
export const selectMeetingAssetSchema = createSelectSchema(meetingAssets);

// Custom schema for artefacts to handle JSON payload properly
export const insertMeetingArtefactSchema = createInsertSchema(
  meetingArtefacts,
  {
    payload: z.any().optional(), // Allow any JSON object
    result: z.any().optional(), // Allow any JSON object
    summary: z.any().optional() // Allow any JSON object
  }
);
export const selectMeetingArtefactSchema = createSelectSchema(meetingArtefacts);

// TypeScript types
export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = typeof meetings.$inferInsert;

export type MeetingAsset = typeof meetingAssets.$inferSelect;
export type NewMeetingAsset = typeof meetingAssets.$inferInsert;

export type MeetingArtefact = typeof meetingArtefacts.$inferSelect;
export type NewMeetingArtefact = typeof meetingArtefacts.$inferInsert;

// Additional schemas for business logic
import { z } from 'zod';

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
