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
import { Image as ImageIcon, Search, FileImage, Download } from 'lucide-react';
import { File as FileRecord } from '../types.shared';
import { getImagesAction } from '../actions/client-server.actions';
import { formatDate } from '../lib/date-utils';

interface ImagePickerProps {
  onSelect: (file: FileRecord) => void;
  trigger?: React.ReactNode;
}

export function ImagePicker({ onSelect, trigger }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, search]);

  const handleSelect = (file: FileRecord) => {
    onSelect(file);
    setIsOpen(false);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[35vh] overflow-y-auto p-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
                onClick={() => handleSelect(image)}
              >
                <div className="flex gap-3">
                  {/* Fixed size preview */}
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML =
                          '<FileImage className="h-8 w-8 text-gray-400" />';
                      }}
                    />
                  </div>

                  {/* File information */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium text-sm truncate mb-1"
                      title={image.title}
                    >
                      {image.title}
                    </h3>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          {image.mimeType.split('/')[1]?.toUpperCase()}
                        </Badge>
                        <span>{formatFileSize(image.fileSize)}</span>
                      </div>

                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(image.createdAt))}
                      </p>

                      {image.description && (
                        <p
                          className="text-xs text-gray-600 line-clamp-2"
                          title={image.description}
                        >
                          {image.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {images.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <FileImage className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No images found</p>
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
