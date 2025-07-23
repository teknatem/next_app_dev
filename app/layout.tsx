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
  MessageSquare,
  BarChart
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
import { UserProfileMenu } from '@/widgets/user-profile-menu/ui/user-profile-menu.client';

import { AppBreadcrumb } from './breadcrumb';
import { AppHeader } from './app-header.client';
import { DesktopNav } from './desktop-nav.client';
import { MainContent } from './main-content.client';
import { SidebarToggle } from './sidebar-toggle.client';
import { ThemeProvider } from './theme-provider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/lib/auth.server';
import { AuthSessionProvider } from './auth-session-provider.client';

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

function AppLogo() {
  return (
    <Link
      href="/"
      className="fixed top-0 left-0 z-50 flex h-12 w-14 items-center justify-center border-r border-b bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
    >
      <div className="flex items-center gap-2">
        <img
          src="/images/robot_icon.svg"
          alt="Brain"
          className="h-6 w-6 text-primary"
        />
      </div>
    </Link>
  );
}

export const metadata = {
  title: 'Next.js App Router + NextAuth + Tailwind CSS',
  description:
    'A BI System configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang={params.lang || 'ru'}
      className="font-inter"
      suppressHydrationWarning
    >
      <body>
        <AuthSessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <ChatProvider>
                <div className="relative flex min-h-screen w-full flex-col bg-pattern">
                  <AppLogo />
                  <DesktopNav />
                  <div className="flex flex-col ml-14">
                    <AppHeader />
                    <MainContent>{children}</MainContent>
                  </div>
                </div>
              </ChatProvider>
            </Providers>
          </ThemeProvider>
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
