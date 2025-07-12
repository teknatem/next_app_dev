'use client';

import { useEffect, useState } from 'react';
import { File } from '../model/files.schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { ClientFormattedDate } from '@/shared/ui/client-formatted-date';
import { toISOString } from '../lib/date-utils';

async function fetchFiles(
  limit: number,
  offset: number,
  includeDeleted: boolean
): Promise<File[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    includeDeleted: String(includeDeleted)
  });
  const response = await fetch(`/api/files-d002?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch files');
  }
  return response.json();
}

interface FileListProps {
  onFileSelect?: (file: File) => void;
  onFileEdit?: (file: File) => void;
}

export function FileList({ onFileSelect, onFileEdit }: FileListProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const limit = 20;

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const fetchedFiles = await fetchFiles(limit, offset, includeDeleted);
        setFiles(fetchedFiles);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadFiles();
  }, [page, includeDeleted]);

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    const response = await fetch(`/api/files-d002/${id}`, { method: 'DELETE' });
    if (response.ok) {
      // Refetch files to update the list
      const offset = (page - 1) * limit;
      const fetchedFiles = await fetchFiles(limit, offset, includeDeleted);
      setFiles(fetchedFiles);
    } else {
      alert('Failed to delete file.');
    }
  };

  if (isLoading) return <p>Loading files...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">File Manager</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeDeleted"
            checked={includeDeleted}
            onCheckedChange={(checked: boolean | 'indeterminate') =>
              setIncludeDeleted(Boolean(checked))
            }
          />
          <Label htmlFor="includeDeleted">Show deleted</Label>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size (KB)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.title}</TableCell>
              <TableCell>{file.mimeType}</TableCell>
              <TableCell>{(file.fileSize / 1024).toFixed(2)}</TableCell>
              <TableCell>
                {file.isDeleted ? (
                  <Badge variant="destructive">Deleted</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                <ClientFormattedDate dateString={toISOString(file.createdAt)} />
              </TableCell>
              <TableCell className="space-x-2">
                {onFileSelect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFileSelect(file)}
                  >
                    Select
                  </Button>
                )}
                {onFileEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFileEdit(file)}
                  >
                    Edit
                  </Button>
                )}
                {!file.isDeleted && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSoftDelete(file.id)}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end space-x-2">
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((p) => p + 1)}
          disabled={files.length < limit}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
