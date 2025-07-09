'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { searchPages } from '../lib';
import { subsystems } from '@/shared/config/subsystems';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allPages = subsystems.flatMap((s) => s.pages);
  const results = query.trim() ? searchPages(query.trim(), allPages) : [];

  // Отладочная информация (только в development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Search debug:', {
      query,
      resultsCount: results.length,
      isOpen
    });
  }

  // Обработчик изменения input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Открываем список при вводе текста
    setIsOpen(true);
  };

  // Закрываем выпадающий список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Отслеживаем изменения query и открываем список
  useEffect(() => {
    if (query.trim()) {
      setIsOpen(true);
    }
  }, [query]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск по системе..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            // Не закрываем сразу, чтобы можно было кликнуть на результат
            setTimeout(() => setIsOpen(false), 200);
          }}
          className="w-64 py-1 text-sm focus:ring-1 focus:ring-ring focus:border-ring"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="h-10 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Выпадающий список поиска */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-[9999] max-h-64 overflow-y-auto min-w-64">
          {query.trim() ? (
            results.length > 0 ? (
              results.map((page) => (
                <Link
                  key={page.id}
                  href={page.path}
                  className="flex items-center gap-3 p-3 hover:bg-accent border-b last:border-b-0"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="font-medium">{page.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {page.description}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                Ничего не найдено
              </div>
            )
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              Введите текст для поиска
            </div>
          )}
        </div>
      )}
    </div>
  );
}
