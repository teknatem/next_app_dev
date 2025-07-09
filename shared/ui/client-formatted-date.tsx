'use client';

import React, { useState, useEffect } from 'react';

interface ClientFormattedDateProps {
  dateString: string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export function ClientFormattedDate({
  dateString,
  locale = 'en-US', // Значение по умолчанию, как у вас было
  options = {}
}: ClientFormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState(dateString); // Изначально показываем "сырую" строку или placeholder

  useEffect(() => {
    // Эта логика выполнится только на клиенте
    try {
      const date = new Date(dateString);
      setFormattedDate(date.toLocaleDateString(locale, options));
    } catch (e) {
      console.error('Error formatting date:', e);
      // В случае ошибки оставляем исходную строку (или можно установить другое значение)
      setFormattedDate(dateString);
    }
  }, [dateString, locale, options]);

  return <>{formattedDate}</>;
}
