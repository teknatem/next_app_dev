'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { Search, Calendar, Clock, MapPin, Video, Check } from 'lucide-react';

import {
  type Meeting,
  type MeetingSearch,
  MeetingStatus
} from '../model/meetings.schema';
import {
  formatMeetingDate,
  formatMeetingTime,
  getMeetingStatus
} from '../lib/date-utils';

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface MeetingPickerProps {
  meetings: Meeting[];
  searchAction: (params: MeetingSearch) => Promise<ActionResult<Meeting[]>>;
  selectedMeetings?: Meeting[];
  onSelectionChange?: (meetings: Meeting[]) => void;
  multiple?: boolean;
  maxSelections?: number;
  className?: string;
}

export function MeetingPicker({
  meetings: initialMeetings,
  searchAction,
  selectedMeetings = [],
  onSelectionChange,
  multiple = false,
  maxSelections,
  className
}: MeetingPickerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOnline, setFilterOnline] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(selectedMeetings.map((m) => m.id))
  );

  useEffect(() => {
    setSelected(new Set(selectedMeetings.map((m) => m.id)));
  }, [selectedMeetings]);

  useEffect(() => {
    setMeetings(initialMeetings);
  }, [initialMeetings]);

  const handleSearch = () => {
    startTransition(async () => {
      const searchParams: MeetingSearch = {};

      if (searchQuery.trim()) {
        searchParams.query = searchQuery.trim();
      }

      if (filterOnline !== null) {
        searchParams.isOnline = filterOnline;
      }

      const result = await searchAction(searchParams);
      if (result.success) {
        setMeetings(result.data);
        setError(null);
      } else {
        setError(result.error);
        console.error('Error searching meetings:', result.error);
      }
    });
  };

  const handleSelectionChange = (meetingId: string, checked: boolean) => {
    const newSelected = new Set(selected);

    if (checked) {
      if (multiple === false) {
        newSelected.clear();
      }
      if (maxSelections && newSelected.size >= maxSelections && multiple) {
        return;
      }
      newSelected.add(meetingId);
    } else {
      newSelected.delete(meetingId);
    }

    setSelected(newSelected);

    const selectedMeetingsList = meetings.filter((m) => newSelected.has(m.id));
    onSelectionChange?.(selectedMeetingsList);
  };

  const handleSelectAll = () => {
    const allIds = new Set(meetings.map((m) => m.id));
    setSelected(allIds);
    onSelectionChange?.(meetings);
  };

  const handleClearAll = () => {
    setSelected(new Set());
    onSelectionChange?.([]);
  };

  const getStatusBadge = (meeting: Meeting) => {
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

  if (isPending) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">Загрузка совещаний...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
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
        <h3 className="text-lg font-semibold">
          Выбор совещаний
          {selected.size > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({selected.size} выбрано)
            </span>
          )}
        </h3>

        {multiple && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Выбрать все
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Очистить
            </Button>
          </div>
        )}
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
            disabled={isPending}
          />
        </div>
        <Button
          variant={filterOnline === true ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterOnline(filterOnline === true ? null : true)}
          disabled={isPending}
        >
          <Video className="h-4 w-4 mr-1" />
          Онлайн
        </Button>
        <Button
          variant={filterOnline === false ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterOnline(filterOnline === false ? null : false)}
          disabled={isPending}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Оффлайн
        </Button>
        <Button size="sm" onClick={handleSearch} disabled={isPending}>
          Найти
        </Button>
      </div>

      {/* Meetings List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
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
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected.has(meeting.id)}
                    onCheckedChange={(checked) =>
                      handleSelectionChange(meeting.id, checked as boolean)
                    }
                    className="mt-1"
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{meeting.title}</h4>
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
                      </div>
                      <div className="flex items-center gap-1">
                        {getLocationIcon(meeting.isOnline)}
                        {meeting.location}
                      </div>
                    </div>
                  </div>

                  {selected.has(meeting.id) && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Selection Info */}
      {multiple && selected.size > 0 && (
        <div className="text-sm text-gray-600">
          Выбрано совещаний: {selected.size}
          {maxSelections && (
            <span className="ml-2">(максимум: {maxSelections})</span>
          )}
        </div>
      )}
    </div>
  );
}
