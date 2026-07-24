import { create } from 'zustand'

interface TopModalStore {
	isOpen: boolean
	open: () => void
	close: () => void
}

export const useTopModalStore = create<TopModalStore>((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
}))