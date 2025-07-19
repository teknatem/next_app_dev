'use client';

import { create } from 'zustand';

/**
 * Хранилище информации о текущем активном домене и состоянии его списка.
 * Используйте хуки set* для обновления конкретных полей, чтобы избежать ненужных перерендериваний.
 */
export interface DomainContextState<Item = any> {
  /** Человекочитаемый код/slug домена (например, "bots") */
  domainSlug: string | null;
  /** Уникальный внутренний идентификатор домена, если есть (UUID или numeric id) */
  domainId: string | null;

  /** Текущий (последний активированный) элемент списка */
  currentItem: Item | null;
  /** Список выбранных элементов при множественном выборе */
  selectedItems: Item[];

  /** Общее количество записей в домене */
  totalCount: number | null;
  /** Количество записей после применения фильтров (без учёта пагинации) */
  filteredCount: number | null;
  /** Количество выбраных (selectedItems.length) – хранится отдельным числом, чтобы подписчики могли обновляться без сравнения массивов */
  selectedCount: number;

  /* ---------- Actions ---------- */
  /** Сменить домен. Если slug отличается от текущего – контекст будет сброшен. */
  setDomain: (slug: string, id?: string | null) => void;
  /** Обновить текущий активный элемент */
  setCurrentItem: (item: Item | null) => void;
  /** Обновить список выбранных элементов */
  setSelectedItems: (items: Item[]) => void;
  /** Обновить счётчики total / filtered */
  setCounts: (total: number | null, filtered: number | null) => void;
  /** Полный сброс контекста (используется при смене домена) */
  reset: () => void;
}

export const useCurrentDomainContext = create<DomainContextState>(
  (set, get) => ({
    domainSlug: null,
    domainId: null,
    currentItem: null,
    selectedItems: [],
    totalCount: null,
    filteredCount: null,
    selectedCount: 0,

    setDomain: (slug, id = null) => {
      if (slug !== get().domainSlug) {
        // При смене домена сбрасываем всё состояние
        set({
          domainSlug: slug,
          domainId: id,
          currentItem: null,
          selectedItems: [],
          totalCount: null,
          filteredCount: null,
          selectedCount: 0
        });
      } else if (id !== get().domainId) {
        // Обновили только идентификатор (например при загрузке метаданных домена)
        set({ domainId: id });
      }
    },

    setCurrentItem: (item) => set({ currentItem: item }),

    setSelectedItems: (items) =>
      set({ selectedItems: items, selectedCount: items.length }),

    setCounts: (total, filtered) =>
      set({ totalCount: total, filteredCount: filtered }),

    reset: () =>
      set({
        domainSlug: null,
        domainId: null,
        currentItem: null,
        selectedItems: [],
        totalCount: null,
        filteredCount: null,
        selectedCount: 0
      })
  })
);
