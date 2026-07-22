import { BoardState } from '@/app/page'
import { create } from 'zustand'
import { Player } from '../types/player'

type GameState = {
  authStatus: 'loading' | 'unauthenticated' | 'authenticated'
  setAuthStatus: (
    newStatus: 'loading' | 'unauthenticated' | 'authenticated',
  ) => void
  board: BoardState | null
  setBoard: (b: BoardState) => void
  profile: Player | null
  setProfile: (p: Player) => void
  profileStatus: 'loading' | 'error' | 'ready'
  setProfileStatus: (s: 'loading' | 'error' | 'ready') => void
  awaitingBoost: boolean
  setAwaitingBoost: (v: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  authStatus: 'loading',
  setAuthStatus: (newStatus) => set(() => ({ authStatus: newStatus })),
  board: null,
  setBoard: (board) => set({ board }),
  profile: null,
  setProfile: (profile) => set({ profile }),
  profileStatus: 'loading',
  setProfileStatus: (profileStatus) => set({ profileStatus }),
  awaitingBoost: false,
  setAwaitingBoost: (awaitingBoost) => set({ awaitingBoost }),
}))
