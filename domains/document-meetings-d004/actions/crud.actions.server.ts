'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { meetingRepositoryServer } from '../data/meeting.repo.server';
import {
  insertMeetingSchema,
  type MeetingSearch,
  type NewMeeting,
  insertMeetingAssetSchema,
  type MeetingAssetWithFileInfo
} from '../model/meetings.schema';
import { fileRepository } from '@/domains/catalog-files-d002/index.server';

// The form data can optionally include an ID for updates
type MeetingFormDataWithId = z.infer<typeof insertMeetingSchema>;

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getMeetingsAction(): Promise<ActionResult<any[]>> {
  try {
    const meetings = await meetingRepositoryServer.getMeetingsWithStats();
    return { success: true, data: meetings };
  } catch (error) {
    console.error('Error getting meetings:', error);
    return { success: false, error: 'Failed to get meetings' };
  }
}

export async function searchMeetingsAction(
  params: MeetingSearch
): Promise<ActionResult<any[]>> {
  try {
    const meetings = await meetingRepositoryServer.search(params);

    // Add statistics to each meeting
    const meetingsWithStats = await Promise.all(
      meetings.map(async (meeting) => {
        const stats = await meetingRepositoryServer.getMeetingStats(meeting.id);
        return {
          ...meeting,
          ...stats
        };
      })
    );

    return { success: true, data: meetingsWithStats };
  } catch (error) {
    console.error('Error searching meetings:', error);
    return { success: false, error: 'Failed to search meetings' };
  }
}

export async function saveMeetingAction(
  formData: MeetingFormDataWithId
): Promise<ActionResult<any>> {
  const dataToProcess = { ...formData };

  // If ID is an empty string, it's a new record. DB will generate UUID.
  if (dataToProcess.id === '') {
    delete dataToProcess.id;
  }

  const dataToValidate = {
    ...dataToProcess,
    ...(dataToProcess.startedAt && {
      startedAt: new Date(dataToProcess.startedAt)
    }),
    ...(dataToProcess.endedAt && { endedAt: new Date(dataToProcess.endedAt) })
  };

  const validationSchema = dataToProcess.id
    ? insertMeetingSchema.partial()
    : insertMeetingSchema;

  const validation = validationSchema.safeParse(dataToValidate);

  if (!validation.success) {
    const errorMessages = validation.error.errors
      .map((e) => e.message)
      .join(', ');
    console.error('Invalid meeting data:', errorMessages);
    return { success: false, error: `Invalid data: ${errorMessages}` };
  }

  const validatedData = validation.data;

  try {
    let savedMeeting;
    if (validatedData.id) {
      const { id, ...data } = validatedData;
      savedMeeting = await meetingRepositoryServer.update(id, data);
    } else {
      savedMeeting = await meetingRepositoryServer.create(
        validatedData as NewMeeting
      );
    }

    revalidatePath('/meetings');
    return { success: true, data: savedMeeting };
  } catch (error) {
    console.error('Error saving meeting:', error);
    return { success: false, error: 'Failed to save meeting' };
  }
}

export async function deleteMeetingAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await meetingRepositoryServer.delete(id);
    revalidatePath('/meetings');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return { success: false, error: 'Failed to delete meeting' };
  }
}

export async function getMeetingByIdAction(
  id: string
): Promise<ActionResult<any | null>> {
  try {
    const meeting = await meetingRepositoryServer.getById(id);
    return { success: true, data: meeting };
  } catch (error) {
    console.error(`Error getting meeting ${id}:`, error);
    return { success: false, error: 'Failed to get meeting' };
  }
}

export async function getAssetsByMeetingIdAction(
  meetingId: string
): Promise<ActionResult<MeetingAssetWithFileInfo[]>> {
  try {
    const assets =
      await meetingRepositoryServer.getAssetsByMeetingId(meetingId);
    return { success: true, data: assets };
  } catch (error) {
    console.error(`Error getting assets for meeting ${meetingId}:`, error);
    return { success: false, error: 'Failed to get assets' };
  }
}

export async function createMeetingAssetAction(data: {
  meetingId: string;
  fileId: string;
}): Promise<ActionResult<any>> {
  try {
    // 0. Validate that meetingId is not empty
    if (!data.meetingId || data.meetingId.trim() === '') {
      return {
        success: false,
        error: 'Meeting must be saved before adding files.'
      };
    }

    // 1. Get the full details of the selected file
    const file = await fileRepository.getFileById(data.fileId);
    if (!file) {
      return { success: false, error: 'Selected file not found.' };
    }

    // 2. Create the asset link using real data from the file
    const asset = await meetingRepositoryServer.createAsset({
      meetingId: data.meetingId,
      fileId: data.fileId,
      kind: 'document', // Or determine from file.mimeType
      originalName: file.title,
      mimeType: file.mimeType,
      storageUrl: file.url
    });

    revalidatePath(`/meetings/${data.meetingId}`);
    return { success: true, data: asset };
  } catch (error) {
    console.error('Error creating meeting asset:', error);
    return { success: false, error: 'Failed to create asset' };
  }
}

export async function deleteMeetingAssetAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await meetingRepositoryServer.deleteAsset(id);
    revalidatePath(`/meetings/`); // Revalidate the general path
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting meeting asset:', error);
    return { success: false, error: 'Failed to delete asset' };
  }
}
