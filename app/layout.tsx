import React from 'react';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
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
import Link from 'next/link';

import { subsystems } from '@/shared/config/subsystems';
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
import { ThemeToggleButton } from '@/shared/ui/theme-toggle-button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/shared/ui/tooltip';
import { SearchInput } from '@/widgets/global-interface-search';
import { ChatProvider, ChatToggleButton } from '@/widgets/llm-chat';
import { UserProfileMenu } from '@/widgets/user-profile-menu/ui/user-profile-menu';

import { AppBreadcrumb } from './breadcrumb';
import { MainContent } from './main-content';
import { ThemeProvider } from './theme-provider';


// Font is now loaded via CSS instead of next/font/google

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
    <aside className="fixed inset-y-0 left-0 z-50 flex w-14 flex-col border-r bg-background/80">
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

function SidebarToggle() {
  return (
    <Button size="icon" variant="outline">
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );
}

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html
      lang={params.lang || 'ru'}
      className="font-inter"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ChatProvider>
              <div className="flex min-h-screen w-full flex-col bg-pattern">
                <DesktopNav />
                <MainContent>
                  <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
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
                  <main className="flex-1 gap-4 p-4 sm:px-6 py-4 md:gap-8">
                    {children}
                  </main>
                </MainContent>
              </div>
            </ChatProvider>
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
