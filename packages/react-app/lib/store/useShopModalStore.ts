import { create } from 'zustand'

interface ShopModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useShopModalStore = create<ShopModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))