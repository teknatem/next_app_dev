'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';

type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: any) => void;

export interface PickerHostOpenOptions<T> {
  title?: string;
  render: (controls: {
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
    close: () => void;
  }) => React.ReactNode;
}

interface PickerHostContextValue {
  open: <T>(options: PickerHostOpenOptions<T>) => Promise<T | null>;
  close: () => void;
}

const PickerHostContext = createContext<PickerHostContextValue | null>(null);

export function PickerHostProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const contentRef = useRef<React.ReactNode>(null);
  const resolveRef = useRef<ResolveFn<any> | null>(null);
  const rejectRef = useRef<RejectFn | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setTitle('');
    contentRef.current = null;
    resolveRef.current = null;
    rejectRef.current = null;
  }, []);

  const open = useCallback(
    <T,>(options: PickerHostOpenOptions<T>) => {
      return new Promise<T | null>((resolve) => {
        const safeResolve = (value: T) => {
          resolve(value);
          close();
        };
        const safeReject = (_reason?: any) => {
          resolve(null);
          close();
        };

        resolveRef.current = resolve as ResolveFn<any>;
        rejectRef.current = safeReject;
        setTitle(options.title || 'Выбор значения');
        contentRef.current = options.render({
          resolve: safeResolve,
          reject: safeReject,
          close
        });
        setIsOpen(true);
      });
    },
    [close]
  );

  const value = useMemo<PickerHostContextValue>(
    () => ({ open, close }),
    [open, close]
  );

  return (
    <PickerHostContext.Provider value={value}>
      {children}
      <Dialog
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        <DialogContent className="w-[50vw] h-[60vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(60vh-56px)] overflow-auto">
            {contentRef.current}
          </div>
        </DialogContent>
      </Dialog>
    </PickerHostContext.Provider>
  );
}

export function usePickerHost() {
  const ctx = useContext(PickerHostContext);
  if (!ctx)
    throw new Error('usePickerHost must be used within a PickerHostProvider');
  return ctx;
}
