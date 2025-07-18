'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  FileText,
  Users,
  Edit,
  Save,
  X,
  Download,
  Play,
  Trash2
} from 'lucide-react';

import {
  type Meeting,
  type MeetingAsset,
  type MeetingAssetWithFileInfo,
  type MeetingArtefact,
  MeetingStatus,
  AssetKind,
  ArtefactType,
  ArtefactStatus
} from '../model/meetings.schema';
import {
  formatMeetingDate,
  formatMeetingTime,
  getMeetingStatus,
  toLocalDateTimeString,
  formatMeetingDuration,
  calculateMeetingDuration
} from '../lib/date-utils';
import { MeetingAssetManager } from './meeting-asset-manager.client';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Helper function to check if asset is audio
function isAudioAsset(asset: { kind: string; mimeType: string }): boolean {
  return asset.kind === 'audio' || asset.mimeType.startsWith('audio/');
}

interface MeetingDetailsProps {
  meeting: Meeting;
  assets: MeetingAssetWithFileInfo[];
  artefacts: MeetingArtefact[];
  saveAction: (formData: any) => Promise<ActionResult<Meeting>>;
  onBack?: () => void;
  className?: string;
  startInEditMode?: boolean;
  createAssetAction: (data: any) => Promise<ActionResult<any>>;
  deleteAssetAction: (id: string) => Promise<ActionResult<void>>;
  createTranscriptionAction: (data: {
    assetId: string;
    language?: string;
    provider?: string;
  }) => Promise<ActionResult<MeetingArtefact>>;
  getArtefactsByMeetingIdAction: (
    meetingId: string
  ) => Promise<ActionResult<MeetingArtefact[]>>;
  deleteArtefactAction: (id: string) => Promise<ActionResult<boolean>>;
}

// Helper type for the form state, using string for dates
type EditFormState = Omit<Partial<Meeting>, 'startedAt' | 'endedAt'> & {
  startedAt: string;
  endedAt: string | null;
};

export function MeetingDetails({
  meeting: initialMeeting,
  assets: initialAssets,
  artefacts: initialArtefacts,
  saveAction,
  onBack,
  className,
  startInEditMode = false,
  createAssetAction,
  deleteAssetAction,
  createTranscriptionAction,
  getArtefactsByMeetingIdAction,
  deleteArtefactAction
}: MeetingDetailsProps) {
  const [meeting, setMeeting] = useState<Meeting>(initialMeeting);
  // No longer need state for assets, we will use the prop directly
  // const [assets, setAssets] = useState<MeetingAsset[]>(initialAssets);
  const [artefacts, setArtefacts] =
    useState<MeetingArtefact[]>(initialArtefacts);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [editForm, setEditForm] = useState<EditFormState | null>(
    startInEditMode
      ? {
          ...initialMeeting,
          startedAt: toLocalDateTimeString(
            new Date(initialMeeting.startedAt).toISOString()
          ),
          endedAt: initialMeeting.endedAt
            ? toLocalDateTimeString(
                new Date(initialMeeting.endedAt).toISOString()
              )
            : null
        }
      : null
  );

  useEffect(() => {
    setMeeting(initialMeeting);
    // setAssets(initialAssets); // No longer needed
    setArtefacts(initialArtefacts);
  }, [initialMeeting, initialArtefacts]);

  const handleSave = () => {
    if (!editForm) return;
    startTransition(async () => {
      const dataToSend = {
        ...editForm,
        startedAt: new Date(editForm.startedAt),
        endedAt: editForm.endedAt ? new Date(editForm.endedAt) : null
      };
      const result = await saveAction(dataToSend);
      if (result.success) {
        setMeeting(result.data);
        setIsEditing(false);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      ...meeting,
      startedAt: toLocalDateTimeString(
        new Date(meeting.startedAt).toISOString()
      ),
      endedAt: meeting.endedAt
        ? toLocalDateTimeString(new Date(meeting.endedAt).toISOString())
        : null
    });
  };

  const handleDeleteAsset = (id: string) => {
    startTransition(async () => {
      const result = await deleteAssetAction(id);
      if (!result.success) {
        setError(result.error);
      }
      // No need to manually filter state, revalidation will update the prop
    });
  };

  const handleDeleteArtefact = (id: string) => {
    startTransition(async () => {
      const result = await deleteArtefactAction(id);
      if (result.success) {
        // Удаляем артефакт из локального состояния
        setArtefacts((prev) => prev.filter((a) => a.id !== id));
      } else {
        setError(result.error);
      }
    });
  };

  const refreshArtefacts = useCallback(async () => {
    if (meeting.id) {
      const result = await getArtefactsByMeetingIdAction(meeting.id);
      if (result.success) {
        setArtefacts(result.data);
      }
    }
  }, [meeting.id, getArtefactsByMeetingIdAction]);

  // Автоматическое обновление артефактов для обработки
  useEffect(() => {
    const processingArtefacts = artefacts.filter(
      (a) => a.status === 'processing' || a.status === 'queued'
    );

    if (processingArtefacts.length > 0) {
      const interval = setInterval(refreshArtefacts, 5000); // Обновляем каждые 5 секунд
      return () => clearInterval(interval);
    }
  }, [artefacts, refreshArtefacts]);

  const getStatusBadge = (m: Meeting) => {
    const status = getMeetingStatus(m.startedAt, m.endedAt);
    switch (status) {
      case MeetingStatus.SCHEDULED:
        return <Badge variant="secondary">Запланировано</Badge>;
      case MeetingStatus.IN_PROGRESS:
        return <Badge variant="default">В процессе</Badge>;
      case MeetingStatus.COMPLETED:
        return <Badge variant="outline">Завершено</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  const getAssetIcon = (kind: string) => {
    switch (kind) {
      case AssetKind.DOCUMENT:
        return <FileText className="h-4 w-4" />;
      case AssetKind.AUDIO:
        return <Play className="h-4 w-4" />;
      case AssetKind.VIDEO:
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!meeting) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8 text-red-500">
          Совещание не найдено
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">Ошибка сохранения!</span> {error}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <X className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">{meeting.title}</h1>
          {getStatusBadge(meeting)}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isPending}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Детали</TabsTrigger>
          <TabsTrigger value="assets">
            Файлы ({initialAssets.length})
          </TabsTrigger>
          <TabsTrigger value="artefacts">
            AI Анализ ({artefacts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Информация о совещании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название</Label>
                    <Input
                      id="title"
                      value={editForm?.title || ''}
                      onChange={(e) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Место проведения</Label>
                    <Input
                      id="location"
                      value={editForm?.location || ''}
                      onChange={(e) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, location: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startedAt">Время начала</Label>
                    <Input
                      id="startedAt"
                      type="datetime-local"
                      value={editForm?.startedAt || ''}
                      onChange={(e) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, startedAt: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endedAt">Время окончания</Label>
                    <Input
                      id="endedAt"
                      type="datetime-local"
                      value={editForm?.endedAt || ''}
                      onChange={(e) =>
                        setEditForm((prev) =>
                          prev ? { ...prev, endedAt: e.target.value } : null
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isOnline"
                      checked={editForm?.isOnline || false}
                      onCheckedChange={(checked) =>
                        setEditForm((prev) =>
                          prev
                            ? { ...prev, isOnline: checked as boolean }
                            : null
                        )
                      }
                    />
                    <Label htmlFor="isOnline">Онлайн совещание</Label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <p className="text-sm text-gray-600">{meeting.title}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Место проведения</Label>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {meeting.isOnline ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {meeting.location}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Время начала</Label>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatMeetingDate(meeting.startedAt)}{' '}
                      {formatMeetingTime(meeting.startedAt)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Время окончания</Label>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {meeting.endedAt
                        ? `${formatMeetingDate(meeting.endedAt)} ${formatMeetingTime(meeting.endedAt)}`
                        : 'Не указано'}
                    </div>
                  </div>

                  {meeting.endedAt && (
                    <div className="space-y-2">
                      <Label>Продолжительность</Label>
                      <p className="text-sm text-gray-600">
                        {formatMeetingDuration(
                          calculateMeetingDuration(
                            meeting.startedAt,
                            meeting.endedAt
                          )
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          {meeting.id ? (
            <MeetingAssetManager
              meetingId={meeting.id}
              createAssetAction={createAssetAction}
            />
          ) : (
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">
                Сначала сохраните совещание, чтобы добавить файлы
              </p>
            </div>
          )}
          <div className="space-y-2">
            {initialAssets.map((asset) => {
              const isAudio = isAudioAsset(asset);
              const assetArtefacts = artefacts.filter(
                (a) => a.assetId === asset.id
              );
              const transcriptionArtefacts = assetArtefacts.filter(
                (artefact) => artefact.artefactType === 'transcript'
              );
              const latestTranscription =
                transcriptionArtefacts.length > 0
                  ? transcriptionArtefacts.sort(
                      (a, b) => b.version - a.version
                    )[0]
                  : null;

              return (
                <Card key={asset.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getAssetIcon(asset.kind)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{asset.fileTitle}</span>
                          <span className="text-sm text-gray-500">
                            ({(asset.fileSize / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        {asset.fileDescription && (
                          <p className="text-sm text-gray-600">
                            {asset.fileDescription}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Тип: {asset.mimeType}</span>
                          <span>•</span>
                          <span>Исходное имя: {asset.originalName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Transcription controls for audio files */}
                    <div className="flex items-center gap-2">
                      {isAudio && (
                        <div className="flex items-center gap-2">
                          {latestTranscription ? (
                            <>
                              {latestTranscription.status === 'done' && (
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 text-xs"
                                  >
                                    Транскрибирован
                                  </Badge>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                      const jsonData = JSON.stringify(
                                        latestTranscription.payload,
                                        null,
                                        2
                                      );
                                      const blob = new Blob([jsonData], {
                                        type: 'application/json'
                                      });
                                      const url = URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `transcription_${asset.originalName}.json`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(url);
                                    }}
                                    className="text-xs p-0 h-auto"
                                  >
                                    Скачать JSON
                                  </Button>
                                </div>
                              )}
                              {latestTranscription.status === 'processing' && (
                                <Badge variant="default" className="text-xs">
                                  Обработка...
                                </Badge>
                              )}
                              {latestTranscription.status === 'queued' && (
                                <Badge variant="secondary" className="text-xs">
                                  В очереди
                                </Badge>
                              )}
                              {latestTranscription.status === 'error' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    startTransition(async () => {
                                      const result =
                                        await createTranscriptionAction({
                                          assetId: asset.id,
                                          language: 'ru',
                                          provider: 'AssemblyAI'
                                        });
                                      if (result.success) {
                                        // Добавляем новый артефакт в список
                                        setArtefacts((prev) => [
                                          ...prev,
                                          result.data
                                        ]);
                                      } else {
                                        setError(result.error);
                                      }
                                    })
                                  }
                                  disabled={isPending}
                                >
                                  Повторить
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                startTransition(async () => {
                                  const result =
                                    await createTranscriptionAction({
                                      assetId: asset.id,
                                      language: 'ru',
                                      provider: 'AssemblyAI'
                                    });
                                  if (result.success) {
                                    // Добавляем новый артефакт в список
                                    setArtefacts((prev) => [
                                      ...prev,
                                      result.data
                                    ]);
                                  } else {
                                    setError(result.error);
                                  }
                                })
                              }
                              disabled={isPending}
                            >
                              {isPending ? 'Создание...' : 'Транскрибировать'}
                            </Button>
                          )}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAsset(asset.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="artefacts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Анализ контента</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshArtefacts}
                  disabled={isPending}
                >
                  Обновить
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {artefacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  AI анализ будет доступен после загрузки аудио/видео файлов
                </div>
              ) : (
                <div className="space-y-4">
                  {artefacts.map((artefact) => (
                    <div key={artefact.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {artefact.artefactType === 'transcript'
                              ? 'Транскрипция'
                              : 'Диаризация'}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({artefact.provider})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {artefact.status === 'done' && (
                            <Badge variant="outline" className="text-green-600">
                              Готово
                            </Badge>
                          )}
                          {artefact.status === 'processing' && (
                            <Badge variant="default">Обработка...</Badge>
                          )}
                          {artefact.status === 'queued' && (
                            <Badge variant="secondary">В очереди</Badge>
                          )}
                          {artefact.status === 'error' && (
                            <Badge variant="destructive">Ошибка</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteArtefact(artefact.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      {artefact.status === 'done' && (
                        <div className="mt-2 flex gap-3">
                          {artefact.payload && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                const jsonData = JSON.stringify(
                                  artefact.payload as any,
                                  null,
                                  2
                                );
                                const blob = new Blob([jsonData], {
                                  type: 'application/json'
                                });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `payload_${artefact.artefactType}_${artefact.id}.json`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }}
                              className="text-sm p-0 h-auto"
                            >
                              Скачать Payload
                            </Button>
                          )}
                          {artefact.result && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                const jsonData = JSON.stringify(
                                  artefact.result as any,
                                  null,
                                  2
                                );
                                const blob = new Blob([jsonData], {
                                  type: 'application/json'
                                });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `result_${artefact.artefactType}_${artefact.id}.json`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }}
                              className="text-sm p-0 h-auto text-blue-600"
                            >
                              Скачать Result
                            </Button>
                          )}
                          {artefact.summary && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => {
                                const jsonData = JSON.stringify(
                                  artefact.summary as any,
                                  null,
                                  2
                                );
                                const blob = new Blob([jsonData], {
                                  type: 'application/json'
                                });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `summary_${artefact.artefactType}_${artefact.id}.json`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                              }}
                              className="text-sm p-0 h-auto text-green-600"
                            >
                              Скачать Summary
                            </Button>
                          )}
                          {artefact.artefactType === 'transcript' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Перенаправляем на страницу редактирования транскрибации
                                window.location.href = `/meetings/${meeting.id}/transcription/${artefact.id}`;
                              }}
                              className="text-sm"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Редактировать транскрибацию
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Создан: {new Date(artefact.createdAt).toLocaleString()}
                        {artefact.completedAt && (
                          <span>
                            {' '}
                            • Завершен:{' '}
                            {new Date(artefact.completedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
