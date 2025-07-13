import { create } from 'zustand';

import { Subsystem } from '@/shared/config/subsystems';

interface UIState {
  currentSubsystem: Subsystem | null;
  setCurrentSubsystem: (subsystem: Subsystem | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentSubsystem: null,
  setCurrentSubsystem: (subsystem) => set({ currentSubsystem: subsystem })
}));
