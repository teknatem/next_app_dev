'use client';

import { PanelLeft, PanelLeftClose } from 'lucide-react';

import { useUIStore } from '@/shared/store/ui-store';
import { Button } from '@/shared/ui/button';

export function SidebarToggle() {
  const { toggleSidebar, isSidebarExpanded } = useUIStore();

  return (
    <Button size="icon" variant="outline" onClick={toggleSidebar}>
      {isSidebarExpanded ? (
        <PanelLeftClose className="h-5 w-5" />
      ) : (
        <PanelLeft className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isSidebarExpanded ? 'Close Menu' : 'Open Menu'}
      </span>
    </Button>
  );
}
