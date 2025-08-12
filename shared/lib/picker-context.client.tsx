'use client';

import React, { createContext, useContext, useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionsMap = Map<string, any>;

const PickerActionsContext = createContext<ActionsMap | null>(null);

export function PickerActionsProvider({
  actions,
  children
}: {
  actions: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const actionsMap = useMemo(() => new Map(Object.entries(actions)), [actions]);
  return (
    <PickerActionsContext.Provider value={actionsMap}>
      {children}
    </PickerActionsContext.Provider>
  );
}

export function usePickerActions<T>(key: string): T {
  const map = useContext(PickerActionsContext);
  if (!map) {
    throw new Error(
      'usePickerActions must be used within a PickerActionsProvider'
    );
  }
  if (!map.has(key)) {
    throw new Error(`No picker actions registered for key: ${key}`);
  }
  return map.get(key) as T;
}
