import { notFound } from 'next/navigation';
import {
  getMeetingByIdAction,
  getAssetsByMeetingIdAction,
  saveMeetingAction,
  createMeetingAssetAction,
  deleteMeetingAssetAction,
  getArtefactsByAssetIdAction,
  createTranscriptionAction,
  getArtefactsByMeetingIdAction,
  deleteArtefactAction
} from '@/domains/document-meetings-d004/index.server';
import {
  MeetingDetails,
  type Meeting,
  type MeetingAsset,
  type MeetingAssetWithFileInfo,
  type MeetingArtefact
} from '@/domains/document-meetings-d004';
import { BackButton } from '@/shared/ui/back-button';

export default async function MeetingDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;
  const isNew = id === 'new';
  const isEditMode = isNew || mode === 'edit';

  let meeting: Meeting;
  let assets: MeetingAssetWithFileInfo[] = [];
  let artefacts: MeetingArtefact[] = [];

  if (isNew) {
    meeting = {
      id: '',
      title: 'Новое совещание',
      startedAt: new Date(),
      endedAt: null,
      location: '',
      isOnline: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      organiserId: null
    };
  } else {
    const meetingResult = await getMeetingByIdAction(id);
    if (!meetingResult.success || !meetingResult.data) {
      notFound();
    }
    meeting = meetingResult.data;

    const assetsResult = await getAssetsByMeetingIdAction(id);
    if (assetsResult.success) {
      assets = assetsResult.data;

      // Load artefacts for all assets
      const artefactsPromises = assets.map(async (asset) => {
        const artefactsResult = await getArtefactsByAssetIdAction(asset.id);
        return artefactsResult.success ? artefactsResult.data : [];
      });

      const artefactsArrays = await Promise.all(artefactsPromises);
      artefacts = artefactsArrays.flat();
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">
          {isNew ? 'Новое совещание' : `Редактирование: ${meeting.title}`}
        </h1>
      </div>
      <MeetingDetails
        meeting={meeting}
        assets={assets}
        artefacts={artefacts}
        saveAction={saveMeetingAction}
        createAssetAction={createMeetingAssetAction}
        deleteAssetAction={deleteMeetingAssetAction}
        createTranscriptionAction={createTranscriptionAction}
        getArtefactsByMeetingIdAction={getArtefactsByMeetingIdAction}
        deleteArtefactAction={deleteArtefactAction}
        startInEditMode={isEditMode}
      />
    </div>
  );
}
