import 'server-only';

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { d003Employees } from '@/domains/catalog-employees-d003/orm.server';
import { d002Files } from '@/domains/catalog-files-d002/orm.server';
import {
  MEETING_ASSET_KINDS,
  MEETING_ARTEFACT_TYPES,
  MEETING_ARTEFACT_STATUSES
} from './model/enums';

// Main meetings table
export const meetings = pgTable('d004_meetings', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  location: text('location').notNull(),
  isOnline: boolean('is_online').notNull(),
  organiserId: uuid('organiser_id').references(() => d003Employees.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
});

// Meeting assets (files and media)
export const meetingAssets = pgTable('d004_meeting_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  meetingId: uuid('meeting_id')
    .references(() => meetings.id, { onDelete: 'cascade' })
    .notNull(),
  kind: text('kind', {
    enum: MEETING_ASSET_KINDS
  }).notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  storageUrl: text('storage_url').notNull(),
  metadata: jsonb('metadata'),
  fileId: uuid('file_id').references(() => d002Files.id)
});

// AI artefacts (transcripts & diarisation)
export const meetingArtefacts = pgTable('d004_meeting_artefacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id')
    .references(() => meetingAssets.id, { onDelete: 'cascade' })
    .notNull(),
  artefactType: text('artefact_type', {
    enum: MEETING_ARTEFACT_TYPES
  }).notNull(),
  provider: text('provider').notNull(),
  language: text('language').default('en').notNull(),
  version: integer('version').default(1).notNull(),
  status: text('status', {
    enum: MEETING_ARTEFACT_STATUSES
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
  organiser: one(d003Employees, {
    fields: [meetings.organiserId],
    references: [d003Employees.id]
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

// TypeScript types (inferred from tables)
export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = typeof meetings.$inferInsert;

export type MeetingAsset = typeof meetingAssets.$inferSelect;
export type NewMeetingAsset = typeof meetingAssets.$inferInsert;

export type MeetingArtefact = typeof meetingArtefacts.$inferSelect;
export type NewMeetingArtefact = typeof meetingArtefacts.$inferInsert;
