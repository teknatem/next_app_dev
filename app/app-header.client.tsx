'use client';

import { UserProfileMenu } from '@/widgets/user-profile-menu/ui/user-profile-menu.client';

import { AppBreadcrumb } from './breadcrumb';
import { SidebarToggle } from './sidebar-toggle.client';
import { SearchInput } from '@/widgets/global-interface-search';
import { ChatToggleButton } from '@/widgets/llm-chat';
import { ThemeToggleButton } from '@/shared/ui/theme-toggle-button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-90 flex h-12 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <SidebarToggle />
        <AppBreadcrumb />
      </div>

      <div className="flex items-center gap-4">
        <SearchInput />
        <ChatToggleButton />
        <ThemeToggleButton />
        <UserProfileMenu />
      </div>
    </header>
  );
}
