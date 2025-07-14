'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Video,
  Eye,
  Plus,
  Filter,
  Trash2,
  Edit,
  File,
  Brain
} from 'lucide-react';
import {
  type Meeting,
  type MeetingSearch,
  type MeetingWithStats,
  MeetingStatus
} from '../model/meetings.schema';
import {
  formatMeetingDate,
  formatMeetingTime,
  getMeetingStatus,
  formatMeetingDuration,
  calculateMeetingDuration
} from '../lib/date-utils';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface MeetingListProps {
  meetings: MeetingWithStats[];
  searchAction: (
    params: MeetingSearch
  ) => Promise<ActionResult<MeetingWithStats[]>>;
  deleteAction: (id: string) => Promise<ActionResult<void>>;
  onMeetingSelect?: (meeting: MeetingWithStats) => void;
  onEditMeeting?: (meeting: MeetingWithStats) => void;
  onCreateMeeting?: () => void;
  className?: string;
}

export function MeetingList({
  meetings: initialMeetings,
  searchAction,
  deleteAction,
  onMeetingSelect,
  className
}: MeetingListProps) {
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingWithStats[]>(initialMeetings);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnline, setFilterOnline] = useState<boolean | null>(null);

  const handleSearch = async () => {
    startTransition(async () => {
      const searchParams: MeetingSearch = {};
      if (searchQuery.trim()) searchParams.query = searchQuery.trim();
      if (filterOnline !== null) searchParams.isOnline = filterOnline;

      const result = await searchAction(searchParams);
      if (result.success) {
        setMeetings(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result.success) {
        setMeetings((prev) => prev.filter((m) => m.id !== id));
      } else {
        setError(result.error);
      }
    });
  };

  const handleCreateMeeting = () => {
    router.push('/meetings/new');
  };

  const handleViewMeeting = (meeting: MeetingWithStats) => {
    router.push(`/meetings/${meeting.id}?mode=view`);
  };

  const handleEditMeeting = (meeting: MeetingWithStats) => {
    router.push(`/meetings/${meeting.id}?mode=edit`);
  };

  const getStatusBadge = (meeting: MeetingWithStats) => {
    const status = getMeetingStatus(meeting.startedAt, meeting.endedAt);

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

  const getLocationIcon = (isOnline: boolean) => {
    return isOnline ? (
      <Video className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };

  if (isPending && meetings.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Совещания</h2>
          <Button onClick={handleCreateMeeting} disabled>
            <Plus className="h-4 w-4 mr-2" />
            Новое совещание
          </Button>
        </div>
        <div className="text-center py-8">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Совещания</h2>
          <Button onClick={handleCreateMeeting}>
            <Plus className="h-4 w-4 mr-2" />
            Новое совещание
          </Button>
        </div>
        <div className="text-center py-8 text-red-500">
          {error}
          <Button onClick={handleSearch} className="ml-4">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Совещания</h2>
        <Button onClick={handleCreateMeeting}>
          <Plus className="h-4 w-4 mr-2" />
          Новое совещание
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск совещаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          variant={filterOnline === true ? 'default' : 'outline'}
          onClick={() => setFilterOnline(filterOnline === true ? null : true)}
        >
          <Video className="h-4 w-4 mr-2" />
          Онлайн
        </Button>
        <Button
          variant={filterOnline === false ? 'default' : 'outline'}
          onClick={() => setFilterOnline(filterOnline === false ? null : false)}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Оффлайн
        </Button>
        <Button onClick={handleSearch}>
          <Filter className="h-4 w-4 mr-2" />
          Применить
        </Button>
      </div>

      {/* Meetings List */}
      <div className="space-y-3">
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Совещания не найдены
          </div>
        ) : (
          meetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{meeting.title}</h3>
                      {getStatusBadge(meeting)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatMeetingDate(meeting.startedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatMeetingTime(meeting.startedAt)}
                        {meeting.endedAt && (
                          <>
                            {' - '}
                            {formatMeetingTime(meeting.endedAt)}{' '}
                            <span className="text-xs">
                              (
                              {formatMeetingDuration(
                                calculateMeetingDuration(
                                  meeting.startedAt,
                                  meeting.endedAt
                                )
                              )}
                              )
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {getLocationIcon(meeting.isOnline)}
                        {meeting.location}
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <File className="h-4 w-4" />
                        <span>{meeting.assetCount} файлов</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        <span>{meeting.artefactCount} артефактов</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMeeting(meeting)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Просмотр
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMeeting(meeting)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(meeting.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
