import { create } from 'zustand'

type GameState = {
	authStatus: 'loading' | 'unauthenticated' | 'authenticated'
	setAuthStatus: (
		newStatus: 'loading' | 'unauthenticated' | 'authenticated',
	) => void
}

export const useGameStore = create<GameState>((set) => ({
	authStatus: 'loading',
	setAuthStatus: (newStatus) => set(() => ({ authStatus: newStatus })),
}))