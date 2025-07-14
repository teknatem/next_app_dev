import { notFound } from 'next/navigation';
import {
  getMeetingByIdAction,
  getAssetsByMeetingIdAction,
  saveMeetingAction,
  createMeetingAssetAction,
  deleteMeetingAssetAction
} from '@/domains/document-meetings-d004/index.server';
import {
  MeetingDetails,
  type Meeting,
  type MeetingAsset,
  type MeetingAssetWithFileInfo,
  type MeetingArtefact
} from '@/domains/document-meetings-d004';
import { BackButton } from '../../../shared/ui/back-button';

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
  const artefacts: MeetingArtefact[] = []; // Placeholder for now

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
    }
    // artefacts would be fetched here
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
        startInEditMode={isEditMode}
      />
    </div>
  );
}
