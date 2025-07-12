'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import React, { useEffect, useState } from 'react';
import { subsystems } from '@/shared/config/subsystems';

// A helper function to find a readable name for a path segment
function getPathName(segment: string, allPages: any[]) {
  const page = allPages.find(
    (p) => p.path?.split('/').pop() === segment || p.slug === segment
  );
  if (page) {
    return page.name;
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function AppBreadcrumb() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or until hydrated
  if (!mounted) {
    return (
      <Breadcrumb>
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

  const pathSegments = pathname.split('/').filter(Boolean);
  const allPages = subsystems.flatMap((s) => [
    ...s.pages,
    { slug: s.slug, name: s.name, path: `/subsystems/${s.slug}` }
  ]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">BI System</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 0 && <BreadcrumbSeparator />}
        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const name = getPathName(segment, allPages);

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
