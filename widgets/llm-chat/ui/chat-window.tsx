'use client';

import { MessageSquare, X, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import type { ChatWindowProps } from '../types';

export function ChatWindow({
  isOpen,
  onClose,
  width,
  onWidthChange
}: ChatWindowProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 bg-background border-l shadow-lg flex flex-col"
      style={{ width: `${width}%` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <span className="font-semibold">LLM Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chat with AI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center py-8">
              LLM Chat будет здесь
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Width resize handle */}
      <div
        className="absolute top-0 left-0 w-1 h-full cursor-ew-resize bg-border hover:bg-border-hover transition-colors"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startWidth = width;

          const handleMouseMove = (e: MouseEvent) => {
            const deltaX = startX - e.clientX;
            const newWidth = startWidth + (deltaX / window.innerWidth) * 100;
            onWidthChange(Math.max(20, Math.min(50, newWidth)));
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      />
    </div>
  );
}
