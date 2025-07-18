import { redirect } from 'next/navigation';
import { TranscriptionEditor } from '@/domains/document-meetings-d004';
import {
  getTranscriptionDataAction,
  saveTranscriptionAction,
  getMeetingByIdAction
} from '@/domains/document-meetings-d004/index.server';
import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TranscriptionPageProps {
  params: Promise<{
    id: string;
    artefactId: string;
  }>;
}

export default async function TranscriptionPage({
  params
}: TranscriptionPageProps) {
  const { id: meetingId, artefactId } = await params;
  // Получаем данные совещания
  const meetingResult = await getMeetingByIdAction(meetingId);
  if (!meetingResult.success) {
    redirect('/meetings');
  }

  // Получаем данные транскрибации
  const transcriptionResult = await getTranscriptionDataAction(artefactId);
  if (!transcriptionResult.success) {
    redirect(`/meetings/${meetingId}`);
  }

  const handleSave = async (data: { result: any; summary: string }) => {
    'use server';

    const result = await saveTranscriptionAction({
      artefactId,
      result: data.result,
      summary: data.summary
    });

    if (result.success) {
      redirect(`/meetings/${meetingId}`);
    } else {
      throw new Error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href={`/meetings/${meetingId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к совещанию
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {meetingResult.data.title}
          </h1>
          <p className="text-gray-600 mt-2">Редактирование транскрибации</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <TranscriptionEditor
              artefactId={artefactId}
              initialData={transcriptionResult.data}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
