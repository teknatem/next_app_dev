import React from 'react';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Link from 'next/link';
import {
  BarChart3,
  Database,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  Upload,
  Users2,
  MessageSquare
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/shared/ui/tooltip';
import { SearchInput } from '@/widgets/global-interface-search';
import { subsystems } from '@/shared/config/subsystems';
import { UserProfileMenu } from '@/widgets/user-profile-menu/ui/user-profile-menu';
import { ChatProvider, ChatToggleButton } from '@/widgets/llm-chat';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

const User = () => {
  return (
    <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm">
      U
    </div>
  );
};

const VercelLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 116 100">
    <path fill="currentColor" d="M57.5 0L115 100H0L57.5 0z" />
  </svg>
);

const NavItem = ({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => {
  return (
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
};

function DesktopNav() {
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
    <aside className="fixed inset-y-0 left-0 z-50 w-14 flex-col border-r bg-background flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <VercelLogo className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">BI System</span>
        </Link>

        {/* Подсистемы из конфигурации */}
        {subsystems.slice(0, 9).map((subsystem) => {
          const Icon =
            iconMap[subsystem.icon as keyof typeof iconMap] || BarChart3;
          return (
            <NavItem
              key={subsystem.id}
              href={`/subsystems/${subsystem.slug}`}
              label={subsystem.name}
            >
              <Icon className="h-5 w-5" />
            </NavItem>
          );
        })}
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/settings" label="Настройки">
          <Settings className="h-5 w-5" />
        </NavItem>
      </nav>
    </aside>
  );
}

function MobileNav() {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <VercelLogo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">BI System</span>
          </Link>

          {/* Подсистемы из конфигурации */}
          {subsystems.slice(0, 9).map((subsystem) => {
            const Icon =
              iconMap[subsystem.icon as keyof typeof iconMap] || BarChart3;
            return (
              <Link
                key={subsystem.id}
                href={`/subsystems/${subsystem.slug}`}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                {subsystem.name}
              </Link>
            );
          })}

          <Link
            href="/settings"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Настройки
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">BI System</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">
        <Providers>
          <ChatProvider>
            <div className="flex min-h-screen w-full flex-col bg-pattern-overlay">
              <DesktopNav />
              <div className="flex flex-col sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                  <MobileNav />
                  <DashboardBreadcrumb />
                  <SearchInput />
                  <ChatToggleButton />
                  <UserProfileMenu />
                </header>
                <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                  {children}
                </main>
              </div>
            </div>
          </ChatProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
