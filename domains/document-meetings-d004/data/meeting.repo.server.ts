import 'server-only';

import { eq, and, like, desc, asc, count, sql } from 'drizzle-orm';
import { db } from '../../../shared/database/connection';
import {
  meetings,
  meetingAssets,
  meetingArtefacts,
  insertMeetingSchema,
  insertMeetingAssetSchema,
  insertMeetingArtefactSchema,
  type Meeting,
  type NewMeeting,
  type MeetingAsset,
  type NewMeetingAsset,
  type MeetingArtefact,
  type NewMeetingArtefact,
  type MeetingSearch,
  type MeetingAssetWithFileInfo
} from '../model/meetings.schema';
import { files } from '../../catalog-files-d002/model/files.schema';

export const meetingRepositoryServer = {
  // Meeting operations
  async getAll(): Promise<Meeting[]> {
    return await db.select().from(meetings).orderBy(desc(meetings.createdAt));
  },

  async getById(id: string): Promise<Meeting | null> {
    const result = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, id))
      .limit(1);

    return result[0] || null;
  },

  async search(params: MeetingSearch): Promise<Meeting[]> {
    const { query, isOnline, organiserId, startedAfter, startedBefore } =
      params;

    const conditions = [];

    if (query) {
      conditions.push(like(meetings.title, `%${query}%`));
    }

    if (isOnline !== undefined) {
      conditions.push(eq(meetings.isOnline, isOnline));
    }

    if (organiserId) {
      conditions.push(eq(meetings.organiserId, organiserId));
    }

    if (startedAfter) {
      conditions.push(sql`${meetings.startedAt} >= ${startedAfter}`);
    }

    if (startedBefore) {
      conditions.push(sql`${meetings.startedAt} <= ${startedBefore}`);
    }

    return await db
      .select()
      .from(meetings)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(meetings.createdAt));
  },

  async create(data: NewMeeting): Promise<Meeting> {
    const validatedData = insertMeetingSchema.parse(data);
    const result = await db.insert(meetings).values(validatedData).returning();
    return result[0];
  },

  async update(id: string, data: Partial<NewMeeting>): Promise<Meeting | null> {
    const validatedData = insertMeetingSchema.partial().parse(data);
    const result = await db
      .update(meetings)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(meetings.id, id))
      .returning();

    return result[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(meetings)
      .where(eq(meetings.id, id))
      .returning();

    return result.length > 0;
  },

  // Asset operations
  async getAssetsByMeetingId(
    meetingId: string
  ): Promise<MeetingAssetWithFileInfo[]> {
    return await db
      .select({
        id: meetingAssets.id,
        meetingId: meetingAssets.meetingId,
        fileId: meetingAssets.fileId,
        kind: meetingAssets.kind,
        originalName: meetingAssets.originalName,
        mimeType: meetingAssets.mimeType,
        storageUrl: meetingAssets.storageUrl,
        fileTitle: files.title,
        fileDescription: files.description,
        fileSize: files.fileSize
      })
      .from(meetingAssets)
      .innerJoin(files, eq(meetingAssets.fileId, files.id))
      .where(eq(meetingAssets.meetingId, meetingId))
      .orderBy(asc(meetingAssets.originalName));
  },

  async getAssetById(id: string): Promise<MeetingAsset | null> {
    const result = await db
      .select()
      .from(meetingAssets)
      .where(eq(meetingAssets.id, id))
      .limit(1);

    return result[0] || null;
  },

  async createAsset(data: NewMeetingAsset): Promise<MeetingAsset> {
    const validatedData = insertMeetingAssetSchema.parse(data);
    const result = await db
      .insert(meetingAssets)
      .values(validatedData)
      .returning();
    return result[0];
  },

  async updateAsset(
    id: string,
    data: Partial<NewMeetingAsset>
  ): Promise<MeetingAsset | null> {
    const validatedData = insertMeetingAssetSchema.partial().parse(data);
    const result = await db
      .update(meetingAssets)
      .set(validatedData)
      .where(eq(meetingAssets.id, id))
      .returning();

    return result[0] || null;
  },

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db
      .delete(meetingAssets)
      .where(eq(meetingAssets.id, id))
      .returning();

    return result.length > 0;
  },

  // Artefact operations
  async getArtefactsByAssetId(assetId: string): Promise<MeetingArtefact[]> {
    return await db
      .select()
      .from(meetingArtefacts)
      .where(eq(meetingArtefacts.assetId, assetId))
      .orderBy(desc(meetingArtefacts.version));
  },

  async getArtefactById(id: string): Promise<MeetingArtefact | null> {
    const result = await db
      .select()
      .from(meetingArtefacts)
      .where(eq(meetingArtefacts.id, id))
      .limit(1);

    return result[0] || null;
  },

  async createArtefact(data: NewMeetingArtefact): Promise<MeetingArtefact> {
    const validatedData = insertMeetingArtefactSchema.parse(data);
    const result = await db
      .insert(meetingArtefacts)
      .values(validatedData)
      .returning();
    return result[0];
  },

  async updateArtefact(
    id: string,
    data: Partial<NewMeetingArtefact>
  ): Promise<MeetingArtefact | null> {
    const validatedData = insertMeetingArtefactSchema.partial().parse(data);
    const result = await db
      .update(meetingArtefacts)
      .set(validatedData)
      .where(eq(meetingArtefacts.id, id))
      .returning();

    return result[0] || null;
  },

  async deleteArtefact(id: string): Promise<boolean> {
    const result = await db
      .delete(meetingArtefacts)
      .where(eq(meetingArtefacts.id, id))
      .returning();

    return result.length > 0;
  },

  // Statistics
  async getMeetingStats(
    meetingId: string
  ): Promise<{ assetCount: number; artefactCount: number }> {
    const [assetResult, artefactResult] = await Promise.all([
      db
        .select({ count: count() })
        .from(meetingAssets)
        .where(eq(meetingAssets.meetingId, meetingId)),
      db
        .select({ count: count() })
        .from(meetingArtefacts)
        .innerJoin(
          meetingAssets,
          eq(meetingArtefacts.assetId, meetingAssets.id)
        )
        .where(eq(meetingAssets.meetingId, meetingId))
    ]);

    return {
      assetCount: assetResult[0]?.count || 0,
      artefactCount: artefactResult[0]?.count || 0
    };
  },

  // Get meetings with statistics
  async getMeetingsWithStats(): Promise<
    Array<Meeting & { assetCount: number; artefactCount: number }>
  > {
    const meetingsData = await this.getAll();

    const meetingsWithStats = await Promise.all(
      meetingsData.map(async (meeting) => {
        const stats = await this.getMeetingStats(meeting.id);
        return {
          ...meeting,
          ...stats
        };
      })
    );

    return meetingsWithStats;
  }
};
