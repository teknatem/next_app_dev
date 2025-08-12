import React from 'react';
import 'server-only';

// Серверный layout для маршрутов внутри (domains)
// Добавляет нижнюю полоску с технической информацией о текущем домене.

import DomainFooter from './DomainFooter.client';
import { PickerHostProvider } from '@/shared/ui/picker-host.client';
import { PickerActionsProvider } from '@/shared/lib/picker-context.client';

export default function DomainsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pickerActions = {
    // NOTE: Регистрируйте actions для конкретных пикеров по месту использования (локально в серверных widget-обёртках)
  } as const;

  return (
    <>
      {/* Global picker host */}
      <PickerHostProvider>
        <PickerActionsProvider actions={pickerActions}>
          {children}
        </PickerActionsProvider>
      </PickerHostProvider>
      {/* Client-side footer */}
      <DomainFooter />
    </>
  );
}
