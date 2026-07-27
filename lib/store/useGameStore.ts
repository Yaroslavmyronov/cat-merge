import { BoardState } from '@/app/page'
import { create } from 'zustand'
import { Player } from '../types/player'

type BoardStatus = 'idle' | 'loading' | 'ready' | 'error'
type ProfileStatus = 'loading' | 'error' | 'ready'
type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

type GameState = {
  authStatus: AuthStatus
  setAuthStatus: (s: AuthStatus) => void
  board: BoardState | null
  setBoard: (b: BoardState) => void
  boardStatus: BoardStatus
  setBoardStatus: (s: BoardStatus) => void
  profile: Player | null
  setProfile: (p: Player) => void
  profileStatus: ProfileStatus
  setProfileStatus: (s: ProfileStatus) => void
  awaitingPurchase: boolean
  setAwaitingPurchase: (v: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
  authStatus: 'loading',
  setAuthStatus: (authStatus) => set({ authStatus }),
  board: null,
  setBoard: (board) => set({ board }),
  boardStatus: 'loading',
  setBoardStatus: (boardStatus) => set({ boardStatus }),
  profile: null,
  setProfile: (profile) => set({ profile }),
  profileStatus: 'loading',
  setProfileStatus: (profileStatus) => set({ profileStatus }),
  awaitingPurchase: false,
  setAwaitingPurchase: (awaitingPurchase) => set({ awaitingPurchase }),
}))
