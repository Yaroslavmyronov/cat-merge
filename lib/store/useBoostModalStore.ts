import { create } from 'zustand';

interface BoostModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useBoostModalStore = create<BoostModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
