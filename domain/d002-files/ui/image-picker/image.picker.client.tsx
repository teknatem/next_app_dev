'use client';

import { useState, useEffect } from 'react';
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
import { Image as ImageIcon, Search, FileImage } from 'lucide-react';
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
  getImagesAction,
  getPresignedUploadUrlAction,
  createFile
} from '../../infra/crud.actions';

export interface ImagePickerBaseProps {
  onSelectAction: (url: string) => void;
  uploadFolder?: string;
}

export interface ImagePickerProps extends ImagePickerBaseProps {
  trigger?: React.ReactNode;
}

export function ImagePickerContent({
  onSelectAction,
  uploadFolder = 'images'
}: ImagePickerBaseProps) {
  const [images, setImages] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState<globalThis.File | null>(null);
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

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getImagesAction({
        limit: 50,
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (result.success && result.data) {
        setImages(result.data);
      } else {
        setError(result.error || 'Failed to load images');
      }
    } catch (err) {
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSelect = (file: FileRecord) => {
    const cleanUrl = file.url.split('?')[0];
    onSelectAction(cleanUrl);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] || null;
    setFile(f);
    setUploadError(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const presign = await getPresignedUploadUrlAction(
        file.type,
        file.size,
        uploadFolder
      );
      if (!presign.success || !presign.data) {
        throw new Error(presign.error || 'Failed to get upload URL');
      }
      const { url, key } = presign.data as { url: string; key: string };

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', file.type);
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
        xhr.send(file);
      });

      const formData = new FormData();
      formData.append('s3Key', key);
      formData.append('url', url.split('?')[0]);
      formData.append('title', file.name);
      formData.append('mimeType', file.type);
      formData.append('fileSize', String(file.size));

      const result = await createFile(formData);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to register file');
      }
      const created: FileRecord = result.data as FileRecord;
      onSelectAction(created.url.split('?')[0]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Upload section */}
      <div className="mb-4 border rounded-lg p-3">
        <div className="text-sm font-medium mb-2">Upload new image</div>
        <div className="flex items-center gap-2">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? `${progress.toFixed(0)}%` : 'Upload'}
          </Button>
        </div>
        {uploadError && (
          <div className="text-xs text-red-600 mt-2">{uploadError}</div>
        )}
      </div>

      {/* No providers required */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading images...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="max-h-[35vh] overflow-y-auto rounded-md border">
          {images.length > 0 ? (
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-[60px]">Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Size</TableHead>
                  <TableHead className="w-[160px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow
                    key={image.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => handleSelect(image)}
                  >
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[320px] truncate"
                        title={image.title}
                      >
                        {image.title}
                      </div>
                      {image.description ? (
                        <div
                          className="text-xs text-muted-foreground truncate max-w-[320px]"
                          title={image.description}
                        >
                          {image.description}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {image.mimeType.split('/')[1]?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatFileSize(image.fileSize)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(new Date(image.createdAt))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FileImage className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No images found</p>
              {search && (
                <p className="text-sm">Try adjusting your search terms</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export function ImagePicker({ onSelectAction, trigger }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ImageIcon className="mr-2 h-4 w-4" />
            Select Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[50vw] h-[50vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
        </DialogHeader>
        <ImagePickerContent
          onSelectAction={(url) => {
            onSelectAction(url);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
