'use client';

import { useRouter } from 'next/navigation';
import { Button } from './button';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" size="icon" onClick={() => router.back()}>
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  );
}
