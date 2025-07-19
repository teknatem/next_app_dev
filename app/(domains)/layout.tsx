import React from 'react';

// Серверный layout для маршрутов внутри (domains)
// Добавляет нижнюю полоску с технической информацией о текущем домене.

import DomainFooter from './DomainFooter.client';

export default function DomainsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* Client-side footer */}
      <DomainFooter />
    </>
  );
}
