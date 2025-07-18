import type {
  TranscriptionPayload,
  TranscriptionResult,
  TranscriptionSegment
} from '../model/meetings.schema';

/**
 * Генерирует уникальный ID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Форматирует имя спикера из AssemblyAI
 */
function formatSpeakerName(speaker: string): string {
  // AssemblyAI может возвращать 'A', 'B', 'C' или 'SPEAKER_00', 'SPEAKER_01'
  if (speaker.startsWith('SPEAKER_')) {
    const num = parseInt(speaker.split('_')[1]) + 1;
    return `Спикер ${num}`;
  }
  // Для простых меток A, B, C
  const speakerMap: { [key: string]: string } = {
    A: 'Спикер 1',
    B: 'Спикер 2',
    C: 'Спикер 3',
    D: 'Спикер 4'
  };
  return speakerMap[speaker] || `Спикер ${speaker}`;
}

/**
 * Парсит payload от AssemblyAI и создает первоначальную структуру result
 * Склеивает фразы одного спикера в единые сегменты
 */
export function parsePayloadToResult(
  payload: TranscriptionPayload
): TranscriptionResult {
  if (!payload.words || payload.words.length === 0) {
    return {
      segments: [],
      metadata: {
        totalDuration: 0,
        speakerCount: 0,
        provider: payload.metadata?.provider,
        language: payload.metadata?.language
      }
    };
  }

  const segments: TranscriptionSegment[] = [];

  // Для AssemblyAI, если нет speaker_labels, создаем один сегмент
  const hasSpeekerLabels = payload.words.some((word) => 'speaker' in word);

  if (!hasSpeekerLabels) {
    // Группируем слова по абзацам если они есть
    if (payload.paragraphs && payload.paragraphs.length > 0) {
      payload.paragraphs.forEach((paragraph, index) => {
        const segment: TranscriptionSegment = {
          id: generateId(),
          start: paragraph.start,
          end: paragraph.end,
          duration: paragraph.end - paragraph.start,
          speaker: `Спикер ${index + 1}`,
          text: paragraph.text
        };
        segments.push(segment);
      });
    } else {
      // Создаем один сегмент из всех слов
      const firstWord = payload.words[0];
      const lastWord = payload.words[payload.words.length - 1];

      const segment: TranscriptionSegment = {
        id: generateId(),
        start: firstWord.start,
        end: lastWord.end,
        duration: lastWord.end - firstWord.start,
        speaker: 'Спикер 1',
        text: payload.text || payload.words.map((w) => w.text).join(' ')
      };
      segments.push(segment);
    }
  } else {
    // Если есть speaker_labels, группируем слова по спикерам
    let currentSpeaker = '';
    let currentText = '';
    let currentStart = 0;
    let currentEnd = 0;

    payload.words.forEach((word, index) => {
      const wordSpeaker = (word as any).speaker || 'A';
      const speakerLabel = formatSpeakerName(wordSpeaker);

      if (currentSpeaker !== speakerLabel) {
        // Сохраняем предыдущий сегмент если он есть
        if (currentSpeaker && currentText) {
          segments.push({
            id: generateId(),
            start: currentStart,
            end: currentEnd,
            duration: currentEnd - currentStart,
            speaker: currentSpeaker,
            text: currentText.trim()
          });
        }

        // Начинаем новый сегмент
        currentSpeaker = speakerLabel;
        currentText = word.text;
        currentStart = word.start;
        currentEnd = word.end;
      } else {
        // Продолжаем текущий сегмент
        currentText += ' ' + word.text;
        currentEnd = word.end;
      }
    });

    // Добавляем последний сегмент
    if (currentSpeaker && currentText) {
      segments.push({
        id: generateId(),
        start: currentStart,
        end: currentEnd,
        duration: currentEnd - currentStart,
        speaker: currentSpeaker,
        text: currentText.trim()
      });
    }
  }

  // Вычисляем метаданные
  const speakers = new Set(segments.map((s) => s.speaker));
  const totalDuration =
    segments.length > 0 ? Math.max(...segments.map((s) => s.end)) : 0;

  return {
    segments,
    metadata: {
      totalDuration,
      speakerCount: speakers.size,
      provider: payload.metadata?.provider,
      language: payload.metadata?.language
    }
  };
}

/**
 * Форматирует время в секундах в строку MM:SS
 */
export function formatTime(seconds: number): string {
  // Проверяем, не передано ли время в миллисекундах
  let timeInSeconds = seconds;
  // Если время больше 3600 (1 час), скорее всего это миллисекунды
  if (seconds > 3600) {
    timeInSeconds = seconds / 1000;
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const remainingSeconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Форматирует длительность в секундах в строку
 */
export function formatDuration(seconds: number): string {
  // Проверяем, не передано ли время в миллисекундах
  let timeInSeconds = seconds;
  // Если время больше 3600 (1 час), скорее всего это миллисекунды
  //if (seconds > 3600) {
  timeInSeconds = seconds / 1000;
  //}

  if (timeInSeconds < 60) {
    return `${Math.floor(timeInSeconds)}с`;
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const remainingSeconds = Math.floor(timeInSeconds % 60);
  return `${minutes}м ${remainingSeconds}с`;
}

/**
 * Проверяет корректность временных меток в сегменте
 */
export function validateSegmentTiming(segment: TranscriptionSegment): boolean {
  // Нормализуем время если оно в миллисекундах
  const normalizeTime = (time: number) => (time > 3600 ? time / 1000 : time);

  const start = normalizeTime(segment.start);
  const end = normalizeTime(segment.end);
  const duration = normalizeTime(segment.duration);

  return start >= 0 && end > start && Math.abs(duration - (end - start)) < 0.1;
}

/**
 * Исправляет временные метки в сегменте
 */
export function fixSegmentTiming(
  segment: TranscriptionSegment
): TranscriptionSegment {
  // Нормализуем время если оно в миллисекундах
  const normalizeTime = (time: number) => (time > 3600 ? time / 1000 : time);

  const start = normalizeTime(segment.start);
  const end = normalizeTime(segment.end);

  return {
    ...segment,
    start,
    end,
    duration: end - start
  };
}
