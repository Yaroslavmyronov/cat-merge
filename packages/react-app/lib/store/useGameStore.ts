
import { BoardState } from '@/app/page'
import { create } from 'zustand'

type GameState = {
	authStatus: 'loading' | 'unauthenticated' | 'authenticated'
	setAuthStatus: (
		newStatus: 'loading' | 'unauthenticated' | 'authenticated',
	) => void
	board: BoardState | null
	setBoard: (b: BoardState) => void
}

export const useGameStore = create<GameState>((set) => ({
	authStatus: 'loading',
	setAuthStatus: (newStatus) => set(() => ({ authStatus: newStatus })),
	board: null,
	setBoard: (board) => set({ board }),
}))