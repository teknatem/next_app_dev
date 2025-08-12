'use server';

import { revalidatePath } from 'next/cache';
import type { MeetingSearch } from '../types.shared';
import {
  getMeetingsAction,
  searchMeetingsAction,
  saveMeetingAction,
  deleteMeetingAction,
  getMeetingByIdAction,
  getAssetsByMeetingIdAction,
  createMeetingAssetAction,
  deleteMeetingAssetAction,
  getArtefactsByAssetIdAction,
  createTranscriptionAction,
  getArtefactByIdAction,
  getArtefactsByMeetingIdAction,
  deleteArtefactAction,
  getTranscriptionDataAction,
  saveTranscriptionAction
} from '../actions/crud.actions.server';

/**
 * Получить список совещаний (Server Action)
 */
export async function getMeetings() {
  const result = await getMeetingsAction();

  return result;
}

/**
 * Поиск совещаний (Server Action)
 */
export async function searchMeetings(searchOptions: MeetingSearch) {
  const result = await searchMeetingsAction(searchOptions);

  return result;
}

/**
 * Сохранить совещание (Server Action)
 */
export async function saveMeeting(formData: FormData) {
  // Convert FormData to expected format
  const meetingData = {
    id: formData.get('id') as string,
    title: formData.get('title') as string,
    location: formData.get('location') as string,
    isOnline: formData.get('isOnline') === 'true',
    organiserId: (formData.get('organiserId') as string) || null,
    startedAt: new Date(formData.get('startedAt') as string),
    endedAt: formData.get('endedAt')
      ? new Date(formData.get('endedAt') as string)
      : null
  };

  const result = await saveMeetingAction(meetingData);

  if (result.success) {
    revalidatePath('/meetings');
    if ('data' in result && result.data?.id) {
      revalidatePath(`/meetings/${result.data.id}`);
    }
  }

  return result;
}

/**
 * Удалить совещание (Server Action)
 */
export async function deleteMeeting(id: string) {
  const result = await deleteMeetingAction(id);

  if (result.success) {
    revalidatePath('/meetings');
    revalidatePath(`/meetings/${id}`);
  }

  return result;
}

/**
 * Получить совещание по ID (Server Action)
 */
export async function getMeetingById(id: string) {
  return await getMeetingByIdAction(id);
}

/**
 * Получить ассеты совещания по ID (Server Action)
 */
export async function getAssetsByMeetingId(meetingId: string) {
  return await getAssetsByMeetingIdAction(meetingId);
}

/**
 * Создать ассет совещания (Server Action)
 */
export async function createMeetingAsset(data: {
  meetingId: string;
  fileId: string;
}) {
  const result = await createMeetingAssetAction(data);

  if (result.success) {
    revalidatePath(`/meetings/${data.meetingId}`);
    revalidatePath('/meetings');
  }

  return result;
}

/**
 * Удалить ассет совещания (Server Action)
 */
export async function deleteMeetingAsset(id: string) {
  const result = await deleteMeetingAssetAction(id);

  if (result.success) {
    // Revalidate общие пути, meetingId нет возможности получить без усложнения
    revalidatePath('/meetings');
  }

  return result;
}

/**
 * Получить артефакты по ID ассета (Server Action)
 */
export async function getArtefactsByAssetId(assetId: string) {
  return await getArtefactsByAssetIdAction(assetId);
}

/**
 * Создать транскрипцию (Server Action)
 */
export async function createTranscription(data: {
  assetId: string;
  language?: string;
  provider?: string;
}) {
  const { assetId, language = 'ru', provider = 'AssemblyAI' } = data;
  const result = await createTranscriptionAction({
    assetId,
    language,
    provider
  });

  if (result.success) {
    // Get meetingId through asset
    const assetsResult = await getAssetsByMeetingIdAction(assetId);
    if (assetsResult.success && assetsResult.data.length > 0) {
      const meetingId = assetsResult.data[0].meetingId;
      revalidatePath(`/meetings/${meetingId}`);
    }
    revalidatePath('/meetings');
  }

  return result;
}

/**
 * Получить артефакт по ID (Server Action)
 */
export async function getArtefactById(id: string) {
  return await getArtefactByIdAction(id);
}

/**
 * Получить артефакты по ID совещания (Server Action)
 */
export async function getArtefactsByMeetingId(meetingId: string) {
  return await getArtefactsByMeetingIdAction(meetingId);
}

/**
 * Удалить артефакт (Server Action)
 */
export async function deleteArtefact(id: string) {
  const result = await deleteArtefactAction(id);

  if (result.success) {
    // Revalidate общие пути, meetingId нет возможности получить без усложнения
    revalidatePath('/meetings');
  }

  return result;
}

/**
 * Получить данные транскрипции (Server Action)
 */
export async function getTranscriptionData(artefactId: string) {
  return await getTranscriptionDataAction(artefactId);
}

/**
 * Сохранить транскрипцию (Server Action)
 */
export async function saveTranscription(data: {
  artefactId: string;
  result: any;
  summary: string;
}) {
  const { artefactId, result, summary } = data;
  const saveResult = await saveTranscriptionAction({
    artefactId,
    result,
    summary
  });

  if (saveResult.success) {
    revalidatePath(`/meetings/*/transcription/${artefactId}`);
    revalidatePath('/meetings');
  }

  return saveResult;
}
