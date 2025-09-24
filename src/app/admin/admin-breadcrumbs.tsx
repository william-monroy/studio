'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// A mapping of path segments to their display names.
const breadcrumbNameMap: { [key: string]: string } = {
    'admin': 'Admin',
    'questions': 'Preguntas',
    'new': 'Nueva',
    'players': 'Jugadores',
    'analytics': 'Analíticas',
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Don't render breadcrumbs on the root admin page.
  if (segments.length <= 1) {
    return <div className="font-semibold text-lg font-headline">Panel de Control</div>;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const displayName = breadcrumbNameMap[segment] || segment;

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-lg font-headline">{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayName}</Link>
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

// Add React to the scope for the fragment
import * as React from 'react';