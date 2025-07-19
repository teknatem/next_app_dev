'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Полоска внизу экрана с технической информацией о текущем домене.
 * Высота 20 px, не блокирует клики на странице.
 */
export default function DomainFooter() {
  const pathname = usePathname();

  // Извлекаем первый сегмент URL – предполагаемый slug домена
  const slug = React.useMemo(() => {
    if (!pathname) return '';
    const withoutSlash = pathname.startsWith('/')
      ? pathname.slice(1)
      : pathname;
    // если маршрут начинается с (domains)/, убираем этот префикс
    const cleaned = withoutSlash.startsWith('(domains)/')
      ? withoutSlash.slice('(domains)/'.length)
      : withoutSlash;
    const first = cleaned.split('/')[0];
    return first;
  }, [pathname]);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[20px] bg-muted/70 text-muted-foreground text-[10px] leading-[20px] px-2 flex justify-between items-center z-50 pointer-events-none select-none">
      <span>{`Текущий домен: ${slug || '—'}`}</span>
      {/* Дополнительную техническую информацию можно добавить здесь */}
    </div>
  );
}
