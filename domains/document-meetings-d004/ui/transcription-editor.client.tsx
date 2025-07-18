'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Badge } from '@/shared/ui/badge';
import {
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  RefreshCw,
  Download
} from 'lucide-react';

import type {
  TranscriptionPayload,
  TranscriptionResult,
  TranscriptionSegment,
  TranscriptionEditorData
} from '../model/meetings.schema';

import {
  parsePayloadToResult,
  formatTime,
  formatDuration,
  validateSegmentTiming,
  fixSegmentTiming
} from '../lib/transcription-parser';

interface TranscriptionEditorProps {
  artefactId: string;
  initialData: TranscriptionEditorData;
  onSave: (data: {
    result: TranscriptionResult;
    summary: string;
  }) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export function TranscriptionEditor({
  artefactId,
  initialData,
  onSave,
  onCancel,
  className = ''
}: TranscriptionEditorProps) {
  const [result, setResult] = useState<TranscriptionResult>(
    initialData.result || { segments: [], metadata: {} }
  );
  const [summary, setSummary] = useState<string>(initialData.summary || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Инициализируем result из payload если он пустой
  useEffect(() => {
    if (
      (!result.segments || result.segments.length === 0) &&
      initialData.payload
    ) {
      const parsedResult = parsePayloadToResult(initialData.payload);
      setResult(parsedResult);
    }
  }, [initialData.payload, result.segments]);

  const handleInitializeFromPayload = () => {
    if (initialData.payload) {
      const parsedResult = parsePayloadToResult(initialData.payload);
      setResult(parsedResult);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave({ result, summary });
      setIsEditing(false);
      setEditingSegmentId(null);
    } catch (error) {
      console.error('Error saving transcription:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSegmentId(null);
    if (onCancel) onCancel();
  };

  const handleAddSegment = () => {
    const newSegment: TranscriptionSegment = {
      id: crypto.randomUUID(),
      start: 0,
      end: 0,
      duration: 0,
      speaker: 'Спикер 1',
      text: ''
    };

    setResult((prev) => ({
      ...prev,
      segments: [...prev.segments, newSegment]
    }));
    setEditingSegmentId(newSegment.id);
  };

  const handleDeleteSegment = (segmentId: string) => {
    setResult((prev) => ({
      ...prev,
      segments: prev.segments.filter((s) => s.id !== segmentId)
    }));
  };

  const handleUpdateSegment = (
    segmentId: string,
    updates: Partial<TranscriptionSegment>
  ) => {
    setResult((prev) => ({
      ...prev,
      segments: prev.segments.map((segment) =>
        segment.id === segmentId
          ? fixSegmentTiming({ ...segment, ...updates })
          : segment
      )
    }));
  };

  const downloadResult = () => {
    const jsonData = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `result_${artefactId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Редактирование транскрибации</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Редактировать
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Отменить
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="payload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payload">Исходные данные</TabsTrigger>
          <TabsTrigger value="result">Результат</TabsTrigger>
          <TabsTrigger value="summary">Суммаризация</TabsTrigger>
        </TabsList>

        <TabsContent value="payload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Исходные данные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Полный текст</Label>
                  <Input
                    value={initialData.payload?.text || 'Нет текста'}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Провайдер</Label>
                    <Input
                      value={
                        initialData.payload?.metadata?.provider || 'Неизвестно'
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Язык</Label>
                    <Input
                      value={
                        initialData.payload?.metadata?.language || 'Неизвестно'
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  Сегменты транскрибации
                  {result.metadata?.speakerCount && (
                    <Badge variant="secondary">
                      {result.metadata.speakerCount} спикер(ов)
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {result.segments.length === 0 && (
                    <Button
                      variant="outline"
                      onClick={handleInitializeFromPayload}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Создать из исходных данных
                    </Button>
                  )}
                  {isEditing && (
                    <Button
                      onClick={handleAddSegment}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Добавить сегмент
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={downloadResult}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Скачать JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {result.segments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Нет сегментов для отображения
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Начало</TableHead>
                      <TableHead className="w-20">Конец</TableHead>
                      <TableHead className="w-24">Длительность</TableHead>
                      <TableHead className="w-32">Спикер</TableHead>
                      <TableHead
                        className={isEditing ? 'min-w-[450px]' : 'w-96'}
                      >
                        Текст
                      </TableHead>
                      {isEditing && (
                        <TableHead className="w-24">Действия</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.segments.map((segment) => (
                      <TableRow key={segment.id}>
                        <TableCell>
                          {isEditing && editingSegmentId === segment.id ? (
                            <Input
                              type="number"
                              step="0.1"
                              value={segment.start}
                              onChange={(e) =>
                                handleUpdateSegment(segment.id, {
                                  start: parseFloat(e.target.value) || 0
                                })
                              }
                              className="w-20"
                            />
                          ) : (
                            formatTime(segment.start)
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing && editingSegmentId === segment.id ? (
                            <Input
                              type="number"
                              step="0.1"
                              value={segment.end}
                              onChange={(e) =>
                                handleUpdateSegment(segment.id, {
                                  end: parseFloat(e.target.value) || 0
                                })
                              }
                              className="w-20"
                            />
                          ) : (
                            formatTime(segment.end)
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDuration(segment.duration)}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={segment.speaker}
                              onChange={(e) =>
                                handleUpdateSegment(segment.id, {
                                  speaker: e.target.value
                                })
                              }
                              className="w-32"
                            />
                          ) : (
                            segment.speaker
                          )}
                        </TableCell>
                        <TableCell className={isEditing ? 'min-w-[450px]' : ''}>
                          {isEditing ? (
                            <textarea
                              value={segment.text}
                              onChange={(e) =>
                                handleUpdateSegment(segment.id, {
                                  text: e.target.value
                                })
                              }
                              className="w-full min-h-[60px] p-2 border rounded-md resize-none"
                              rows={3}
                            />
                          ) : (
                            <div
                              className="max-w-md whitespace-pre-wrap"
                              title={segment.text}
                            >
                              {segment.text}
                            </div>
                          )}
                        </TableCell>
                        {isEditing && (
                          <TableCell>
                            <div className="flex gap-1">
                              {editingSegmentId === segment.id ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingSegmentId(null)}
                                  title="Сохранить время"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setEditingSegmentId(segment.id)
                                  }
                                  title="Редактировать время"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSegment(segment.id)}
                                title="Удалить сегмент"
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Суммаризация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="summary">Суммаризация</Label>
                  <Input
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Введите суммаризацию транскрибации..."
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Исходные данные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Полный текст</Label>
                  <Input
                    value={initialData.payload?.text || 'Нет текста'}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Провайдер</Label>
                    <Input
                      value={
                        initialData.payload?.metadata?.provider || 'Неизвестно'
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Язык</Label>
                    <Input
                      value={
                        initialData.payload?.metadata?.language || 'Неизвестно'
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
