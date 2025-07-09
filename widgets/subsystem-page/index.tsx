import { Subsystem } from './types';
import { SubsystemHeader, PagesGrid } from './ui';

interface SubsystemPageProps {
  subsystem: Subsystem;
}

export function SubsystemPage({ subsystem }: SubsystemPageProps) {
  return (
    <div className="space-y-6">
      <SubsystemHeader subsystem={subsystem} />
      <PagesGrid pages={subsystem.pages} />
    </div>
  );
}
