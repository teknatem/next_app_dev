import 'server-only';
import { z } from 'zod';
import { meetingRepositoryServer } from '../data/meeting.repo.server';
import {
  insertMeetingSchema,
  type MeetingSearch,
  type NewMeeting,
  insertMeetingAssetSchema,
  type MeetingAssetWithFileInfo,
  saveTranscriptionSchema
} from '../types.shared';
import { fileRepository } from '@/domains/catalog-files-d002/index.server';
import { type MeetingArtefact } from '../types.shared';
import { assemblyAIService } from '../lib/assemblyai.service.server';

// Helper function to determine asset kind from MIME type
function getAssetKindFromMimeType(
  mimeType: string
): 'document' | 'audio' | 'video' {
  if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  }
  return 'document';
}

// Helper function to check if asset is audio
function isAudioAsset(asset: { kind: string; mimeType: string }): boolean {
  return asset.kind === 'audio' || asset.mimeType.startsWith('audio/');
}

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
    // Determine asset kind from MIME type
    const kind = getAssetKindFromMimeType(file.mimeType);

    const asset = await meetingRepositoryServer.createAsset({
      meetingId: data.meetingId,
      fileId: data.fileId,
      kind,
      originalName: file.title,
      mimeType: file.mimeType,
      storageUrl: file.url
    });

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

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Error deleting meeting asset:', error);
    return { success: false, error: 'Failed to delete asset' };
  }
}

// ==================== ARTEFACT ACTIONS ====================

export async function getArtefactsByAssetIdAction(
  assetId: string
): Promise<ActionResult<MeetingArtefact[]>> {
  try {
    const artefacts =
      await meetingRepositoryServer.getArtefactsByAssetId(assetId);
    return { success: true, data: artefacts };
  } catch (error) {
    console.error(`Error getting artefacts for asset ${assetId}:`, error);
    return { success: false, error: 'Failed to get artefacts' };
  }
}

export async function createTranscriptionAction(data: {
  assetId: string;
  language?: string;
  provider?: string;
}): Promise<ActionResult<MeetingArtefact>> {
  try {
    const { assetId, language = 'ru', provider = 'AssemblyAI' } = data;

    // Check if asset exists
    const asset = await meetingRepositoryServer.getAssetById(assetId);
    if (!asset) {
      return { success: false, error: 'Asset not found' };
    }

    // Check if asset is audio
    if (!isAudioAsset(asset)) {
      return { success: false, error: 'Only audio files can be transcribed' };
    }

    // Create artefact record with queued status
    const artefact = await meetingRepositoryServer.createArtefact({
      assetId,
      artefactType: 'transcript',
      provider,
      language,
      version: 1,
      status: 'queued'
    });

    // Start transcription process asynchronously
    processTranscriptionAsync(artefact.id, asset, { language });

    return { success: true, data: artefact };
  } catch (error) {
    console.error('Error creating transcription:', error);
    return { success: false, error: 'Failed to create transcription' };
  }
}

// Helper function to process transcription asynchronously
async function processTranscriptionAsync(
  artefactId: string,
  asset: { storageUrl: string; fileId: string | null },
  options: { language?: string }
): Promise<void> {
  try {
    // Update status to processing
    await meetingRepositoryServer.updateArtefact(artefactId, {
      status: 'processing'
    });

    // Perform transcription with AssemblyAI
    let transcriptionResult;

    if (asset.fileId) {
      // Get file details to get S3 key
      const file = await fileRepository.getFileById(asset.fileId);
      if (file && file.s3Key) {
        // Use S3 key for transcription (more reliable)
        transcriptionResult = await assemblyAIService.transcribeFromS3(
          file.s3Key,
          {
            language: options.language || 'ru',
            speaker_labels: true
          }
        );
      } else {
        throw new Error('File not found or missing S3 key');
      }
    } else {
      // Fallback to storage URL
      transcriptionResult = await assemblyAIService.transcribeFromStorage(
        asset.storageUrl,
        {
          language: options.language || 'ru',
          speaker_labels: true
        }
      );
    }

    if (
      transcriptionResult.status === 'completed' &&
      transcriptionResult.text
    ) {
      // Update artefact with successful result
      await meetingRepositoryServer.updateArtefact(artefactId, {
        status: 'done',
        payload: {
          text: transcriptionResult.text,
          confidence: transcriptionResult.confidence,
          words: transcriptionResult.words,
          paragraphs: transcriptionResult.paragraphs,
          metadata: {
            provider: 'AssemblyAI',
            language: options.language || 'ru',
            transcriptId: transcriptionResult.id
          }
        },
        completedAt: new Date()
      });
    } else {
      // Update artefact with error status
      await meetingRepositoryServer.updateArtefact(artefactId, {
        status: 'error',
        payload: {
          error: transcriptionResult.error || 'Transcription failed',
          metadata: {
            provider: 'AssemblyAI',
            transcriptId: transcriptionResult.id
          }
        },
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error processing transcription:', error);
    // Update artefact with error status
    await meetingRepositoryServer.updateArtefact(artefactId, {
      status: 'error',
      payload: {
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          provider: 'AssemblyAI'
        }
      },
      completedAt: new Date()
    });
  }
}

export async function getArtefactByIdAction(
  id: string
): Promise<ActionResult<MeetingArtefact | null>> {
  try {
    const artefact = await meetingRepositoryServer.getArtefactById(id);
    return { success: true, data: artefact };
  } catch (error) {
    console.error(`Error getting artefact ${id}:`, error);
    return { success: false, error: 'Failed to get artefact' };
  }
}

export async function getArtefactsByMeetingIdAction(
  meetingId: string
): Promise<ActionResult<MeetingArtefact[]>> {
  try {
    // Get all assets for this meeting
    const assets =
      await meetingRepositoryServer.getAssetsByMeetingId(meetingId);

    // Get all artefacts for these assets
    const allArtefacts: MeetingArtefact[] = [];
    for (const asset of assets) {
      const artefacts = await meetingRepositoryServer.getArtefactsByAssetId(
        asset.id
      );
      allArtefacts.push(...artefacts);
    }

    return { success: true, data: allArtefacts };
  } catch (error) {
    console.error(`Error getting artefacts for meeting ${meetingId}:`, error);
    return { success: false, error: 'Failed to get artefacts' };
  }
}

export async function deleteArtefactAction(
  id: string
): Promise<ActionResult<boolean>> {
  try {
    const result = await meetingRepositoryServer.deleteArtefact(id);

    if (result) {
      return { success: true, data: true };
    } else {
      return { success: false, error: 'Artefact not found' };
    }
  } catch (error) {
    console.error(`Error deleting artefact ${id}:`, error);
    return { success: false, error: 'Failed to delete artefact' };
  }
}

export async function getTranscriptionDataAction(
  artefactId: string
): Promise<ActionResult<any>> {
  try {
    const artefact = await meetingRepositoryServer.getArtefactById(artefactId);
    if (!artefact) {
      return { success: false, error: 'Artefact not found' };
    }

    const data = {
      payload: artefact.payload || {},
      result: artefact.result || null,
      summary: artefact.summary || ''
    };

    return { success: true, data };
  } catch (error) {
    console.error('Error getting transcription data:', error);
    return { success: false, error: 'Failed to get transcription data' };
  }
}

export async function saveTranscriptionAction(data: {
  artefactId: string;
  result: any;
  summary: string;
}): Promise<ActionResult<boolean>> {
  try {
    const { artefactId, result, summary } = data;

    // Валидация данных
    const validationResult = saveTranscriptionSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: `Invalid data: ${validationResult.error.message}`
      };
    }

    // Получаем артефакт для получения meetingId
    const artefact = await meetingRepositoryServer.getArtefactById(artefactId);
    if (!artefact) {
      return { success: false, error: 'Artefact not found' };
    }

    // Обновляем артефакт с новыми данными
    await meetingRepositoryServer.updateArtefact(artefactId, {
      result,
      summary
    });

    // Получаем asset для revalidation
    const asset = await meetingRepositoryServer.getAssetById(artefact.assetId);

    return { success: true, data: true };
  } catch (error) {
    console.error('Error saving transcription:', error);
    return { success: false, error: 'Failed to save transcription' };
  }
}
