'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { FileIcon, Search } from 'lucide-react';
import { File as FileRecord } from '../../types.shared';
import { formatDate } from '../../lib/date-utils.shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import {
  getFiles,
  getPresignedUploadUrlAction,
  createFile
} from '../../infra/crud.actions';

export interface FilePickerDialogProps {
  trigger?: React.ReactNode;
  onSelectFile: (file: FileRecord) => void;
  uploadFolder?: string;
}

export function FilePickerDialog({
  trigger,
  onSelectFile,
  uploadFolder = 'general'
}: FilePickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [fileToUpload, setFileToUpload] = useState<globalThis.File | null>(
    null
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFiles({
        limit: 50,
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      if (result.success && result.data) {
        setFiles(result.data as FileRecord[]);
      } else {
        setError(result.error || 'Failed to load files');
      }
    } catch {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, search]);

  const handleSelect = (file: FileRecord) => {
    onSelectFile(file);
    setIsOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] || null;
    setFileToUpload(f);
    setUploadError(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;
    setUploading(true);
    setUploadError(null);
    try {
      const presign = await getPresignedUploadUrlAction(
        fileToUpload.type,
        fileToUpload.size,
        uploadFolder
      );
      if (!presign.success || !presign.data) {
        throw new Error(presign.error || 'Failed to get upload URL');
      }
      const { url, key } = presign.data as { url: string; key: string };

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', fileToUpload.type);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress((event.loaded / event.total) * 100);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.timeout = 60000;
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
        xhr.send(fileToUpload);
      });

      const formData = new FormData();
      formData.append('s3Key', key);
      formData.append('url', url.split('?')[0]);
      formData.append('title', fileToUpload.name);
      formData.append('mimeType', fileToUpload.type);
      formData.append('fileSize', String(fileToUpload.size));

      const result = await createFile(formData);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to register file');
      }
      const created: FileRecord = result.data as FileRecord;
      onSelectFile(created);
      setIsOpen(false);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileIcon className="mr-2 h-4 w-4" />
            Select File
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[60vw] h-[60vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select a File</DialogTitle>
        </DialogHeader>

        {/* Upload */}
        <div className="mb-4 border rounded-lg p-3">
          <div className="text-sm font-medium mb-2">Upload new file</div>
          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={!fileToUpload || uploading}
            >
              {uploading ? `${progress.toFixed(0)}%` : 'Upload'}
            </Button>
          </div>
          {uploadError && (
            <div className="text-xs text-red-600 mt-2">{uploadError}</div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading files...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="max-h-[40vh] overflow-y-auto rounded-md border">
            {files.length > 0 ? (
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead className="w-[60px]">Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-[160px]">MIME</TableHead>
                    <TableHead className="w-[120px]">Size</TableHead>
                    <TableHead className="w-[160px]">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((f) => (
                    <TableRow
                      key={f.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => handleSelect(f)}
                    >
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          {f.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[320px] truncate" title={f.title}>
                          {f.title}
                        </div>
                        {f.description ? (
                          <div
                            className="text-xs text-muted-foreground truncate max-w-[320px]"
                            title={f.description}
                          >
                            {f.description}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {f.mimeType}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatFileSize(f.fileSize)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(new Date(f.createdAt))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <FileIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No files found</p>
                {search && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
