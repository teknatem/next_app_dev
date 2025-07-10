'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/shared/store/ui-store';
import { Subsystem } from './types';
import { PagesGrid } from './ui';

interface SubsystemPageProps {
  subsystem: Subsystem;
}

export function SubsystemPage({ subsystem }: SubsystemPageProps) {
  const setCurrentSubsystem = useUIStore((state) => state.setCurrentSubsystem);

  useEffect(() => {
    setCurrentSubsystem(subsystem);

    return () => {
      setCurrentSubsystem(null);
    };
  }, [subsystem, setCurrentSubsystem]);

  return (
    <div className="space-y-6">
      <PagesGrid pages={subsystem.pages} />
    </div>
  );
}
