import { Page } from '../types';
import { PageCard } from './page-card';

interface PagesGridProps {
  pages: Page[];
}

export function PagesGrid({ pages }: PagesGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <PageCard key={page.id} page={page} />
      ))}
    </div>
  );
}
