'use client';

import React, { createContext, useContext } from 'react';
import type { File as FileRecord } from '../types.shared';

type GetImagesAction = (options: {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: 'title' | 'description' | 'mimeType' | 'fileSize' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}) => Promise<{ success: boolean; data?: FileRecord[]; error?: string }>;

export interface FilesActionsContextValue {
  getImagesAction?: GetImagesAction;
}

const FilesActionsContext = createContext<FilesActionsContextValue | null>(
  null
);

export function FilesActionsProvider({
  children,
  getImagesAction
}: React.PropsWithChildren<FilesActionsContextValue>) {
  return (
    <FilesActionsContext.Provider value={{ getImagesAction }}>
      {children}
    </FilesActionsContext.Provider>
  );
}

export function useFilesActions(throwIfMissing: boolean = true) {
  const ctx = useContext(FilesActionsContext);
  if (!ctx && throwIfMissing) {
    throw new Error(
      'useFilesActions must be used within a FilesActionsProvider. '
    );
  }
  return ctx;
}
