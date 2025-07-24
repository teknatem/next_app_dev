'use client';

import {
  BarChart3,
  Database,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  Upload,
  Users2
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { subsystems } from '@/shared/config/subsystems';
import { useUIStore } from '@/shared/store/ui-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';

const NavItem = ({
  href,
  label,
  children,
  isExpanded
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  isExpanded: boolean;
}) => {
  const content = isExpanded ? (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
    >
      {children}
      {label}
    </Link>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );

  return content;
};

export function DesktopNav() {
  const { isSidebarExpanded } = useUIStore();
  const iconMap = {
    BarChart3,
    Database,
    Home,
    LineChart,
    Package,
    Package2,
    Upload,
    Users2
  };

  return (
    <aside
      className={`fixed top-12 left-0 bottom-0 z-50 flex flex-col border-r bg-background/10 transition-all duration-300 ${
        isSidebarExpanded ? 'w-64' : 'w-14'
      }`}
      style={{
        background:
          'linear-gradient(to right, hsl(var(--background) / 1) 0%, hsl(var(--background) / 0.2) 100%)'
      }}
    >
      <nav
        className={`flex flex-col gap-4 px-2 ${
          isSidebarExpanded ? 'items-stretch sm:py-5' : 'items-center sm:py-5'
        }`}
      >
        {subsystems.slice(0, 9).map((subsystem) => {
          const Icon =
            iconMap[subsystem.icon as keyof typeof iconMap] || BarChart3;
          return (
            <NavItem
              key={subsystem.id}
              href={`/subsystems/${subsystem.slug}`}
              label={subsystem.name}
              isExpanded={isSidebarExpanded}
            >
              <Icon className="h-5 w-5" />
            </NavItem>
          );
        })}
      </nav>

      <nav
        className={`mt-auto flex flex-col gap-4 px-2 ${
          isSidebarExpanded ? 'items-stretch sm:py-5' : 'items-center sm:py-5'
        }`}
      >
        <NavItem
          href="/settings"
          label="Настройки"
          isExpanded={isSidebarExpanded}
        >
          <Settings className="h-5 w-5" />
        </NavItem>
      </nav>
    </aside>
  );
}
