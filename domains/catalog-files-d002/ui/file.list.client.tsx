'use client';

import React, { useTransition, useEffect, useState, useCallback } from 'react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from '@/shared/ui/icons';

import { formatDateDDMMYYYY } from '../lib/date-utils';
import { File } from '../types.shared';
import { getFiles, softDeleteFile } from '../features/crud.server';

type SortField =
  | 'title'
  | 'description'
  | 'mimeType'
  | 'fileSize'
  | 'createdAt';
type SortOrder = 'asc' | 'desc';

// ============================================================================
// 1. Controls Component (Search and Toggle)
// ============================================================================
interface FileControlsProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  includeDeleted: boolean;
  onIncludeDeletedChange: (checked: boolean) => void;
}

const FileControls = React.memo(function FileControls({
  searchInput,
  onSearchChange,
  includeDeleted,
  onIncludeDeletedChange
}: FileControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-4/5 max-w-md">
        <Input
          placeholder="Search by name or comment..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-full pr-10"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="includeDeleted"
          checked={includeDeleted}
          onCheckedChange={onIncludeDeletedChange}
        />
        <Label htmlFor="includeDeleted" className="text-sm">
          Show deleted
        </Label>
      </div>
    </div>
  );
});
FileControls.displayName = 'FileControls';

// ============================================================================
// 2. Table Component
// ============================================================================
interface FileTableProps {
  files: File[];
  isPending: boolean;
  getSortIcon: (field: SortField) => React.ReactNode;
  handleSort: (field: SortField) => void;
  handleSoftDelete: (id: string) => void;
  onFileSelect?: (_file: File) => void;
  onFileEdit?: (_file: File) => void;
}

const FileTable = React.memo(function FileTable({
  files,
  isPending,
  getSortIcon,
  handleSort,
  handleSoftDelete,
  onFileSelect,
  onFileEdit
}: FileTableProps) {
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="py-2 cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-1">
                Name{getSortIcon('title')}
              </div>
            </TableHead>
            <TableHead
              className="py-2 cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('description')}
            >
              <div className="flex items-center gap-1">
                Comment{getSortIcon('description')}
              </div>
            </TableHead>
            <TableHead
              className="py-2 cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('mimeType')}
            >
              <div className="flex items-center gap-1">
                Type{getSortIcon('mimeType')}
              </div>
            </TableHead>
            <TableHead
              className="py-2 cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('fileSize')}
            >
              <div className="flex items-center gap-1">
                Size{getSortIcon('fileSize')}
              </div>
            </TableHead>
            <TableHead className="py-2">Status</TableHead>
            <TableHead
              className="py-2 cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center gap-1">
                Created{getSortIcon('createdAt')}
              </div>
            </TableHead>
            <TableHead className="py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id} className="hover:bg-muted/50">
              <TableCell className="font-medium py-2">{file.title}</TableCell>
              <TableCell className="py-2 text-sm text-muted-foreground max-w-xs truncate">
                {file.description || '-'}
              </TableCell>
              <TableCell className="py-2 text-sm">{file.mimeType}</TableCell>
              <TableCell className="py-2 text-sm">
                {formatFileSize(file.fileSize)}
              </TableCell>
              <TableCell className="py-2">
                {file.isDeleted === true ? (
                  <Badge variant="destructive" className="text-xs">
                    Deleted
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-2 text-sm">
                {formatDateDDMMYYYY(file.createdAt)}
              </TableCell>
              <TableCell className="py-2 space-x-1">
                {onFileSelect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFileSelect(file)}
                    className="h-7 px-2 text-xs"
                  >
                    Select
                  </Button>
                )}
                {onFileEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFileEdit(file)}
                    className="h-7 px-2 text-xs"
                  >
                    Edit
                  </Button>
                )}
                {file.isDeleted === false && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSoftDelete(file.id)}
                    disabled={isPending}
                    className="h-7 px-2 text-xs"
                  >
                    {isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
FileTable.displayName = 'FileTable';

// ============================================================================
// 3. Main Container Component
// ============================================================================
interface FileListProps {
  onFileSelect?: (_file: File) => void;
  onFileEdit?: (_file: File) => void;
}

export function FileList({ onFileSelect, onFileEdit }: FileListProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isPending, startTransition] = useTransition();
  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== searchInput) {
        setSearchQuery(searchInput);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      const result = await getFiles({
        limit,
        offset,
        includeDeleted,
        search: searchQuery,
        sortBy,
        sortOrder
      });
      if (result.success && result.data) {
        setFiles(result.data);
      } else {
        setError(result.error || 'Failed to fetch files');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, includeDeleted, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleSoftDelete = useCallback(
    async (id: string) => {
      if (!confirm('Are you sure you want to delete this file?')) return;
      startTransition(async () => {
        const result = await softDeleteFile(id);
        if (result.success) {
          await loadFiles();
        } else {
          alert(`Failed to delete file: ${result.error}`);
        }
      });
    },
    [loadFiles]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      setSortBy((current) => (current === field ? current : field));
      setSortOrder((current) =>
        sortBy === field ? (current === 'asc' ? 'desc' : 'asc') : 'asc'
      );
      setPage(1);
    },
    [sortBy]
  );

  const getSortIcon = useCallback(
    (field: SortField): React.ReactNode => {
      if (sortBy !== field)
        return <ChevronDownIcon className="h-4 w-4 opacity-50" />;
      return sortOrder === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" />
      );
    },
    [sortBy, sortOrder]
  );

  return (
    <div className="space-y-4">
      <FileControls
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={setIncludeDeleted}
      />

      {isLoading && <p>Loading files...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <>
          <FileTable
            files={files}
            isPending={isPending}
            getSortIcon={getSortIcon}
            handleSort={handleSort}
            handleSoftDelete={handleSoftDelete}
            onFileSelect={onFileSelect}
            onFileEdit={onFileEdit}
          />
          {files.length > 0 && (
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={files.length < limit}
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
          {files.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? 'No files found matching your search.'
                : 'No files found.'}
            </div>
          )}
        </>
      )}
    </div>
  );
}
