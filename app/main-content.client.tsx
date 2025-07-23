'use client';

import React from 'react';

import { useUIStore } from '@/shared/store/ui-store';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isSidebarExpanded } = useUIStore();

  return (
    <main
      className="flex-1 gap-4 p-4 sm:px-6 py-4 md:gap-8 transition-all duration-300"
      style={{
        marginLeft: isSidebarExpanded ? '256px' : '56px'
      }}
    >
      {children}
    </main>
  );
}
