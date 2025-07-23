import { create } from 'zustand';

import { Subsystem } from '@/shared/config/subsystems';

interface UIState {
  currentSubsystem: Subsystem | null;
  setCurrentSubsystem: (subsystem: Subsystem | null) => void;
  isChatOpen: boolean;
  setChatOpen: (isOpen: boolean) => void;
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentSubsystem: null,
  setCurrentSubsystem: (subsystem) => set({ currentSubsystem: subsystem }),
  isChatOpen: false,
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
  isSidebarExpanded: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded }))
}));
