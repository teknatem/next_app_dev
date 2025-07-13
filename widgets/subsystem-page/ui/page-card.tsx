import {
  Home,
  Database,
  Upload,
  FileText,
  Package,
  Users2,
  BarChart3,
  LineChart
} from 'lucide-react';
import Link from 'next/link';

import { Page } from '../types';

interface PageCardProps {
  page: Page;
}

const iconMap = {
  Home,
  Database,
  Upload,
  FileText,
  Package,
  Users2,
  BarChart3,
  LineChart
};

export function PageCard({ page }: PageCardProps) {
  const Icon = iconMap[page.icon as keyof typeof iconMap] || FileText;

  return (
    <Link
      href={page.path}
      className="group block p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-md bg-blue-100 group-hover:bg-blue-200">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="font-semibold">{page.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{page.description}</p>
    </Link>
  );
}
