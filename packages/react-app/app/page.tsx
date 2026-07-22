'use client'

import { BottomNav } from '@/components/BottomNav'
import { FarmBoard } from '@/components/FarmBoard'
import { SpawnZone } from '@/components/SpawnZone'
import { apiFetch } from '@/lib/api/fetchInstance'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardCell, BoardResponse } from '@/lib/types/board'
import { Player } from '@/lib/types/player'
import { useEffect, useState } from 'react'

export interface BoardState extends Omit<BoardResponse, 'cells'> {
  cells: (BoardCell | null)[]
}

export default function Home() {
  const state = useGameStore((s) => s.board)
  const setBoard = useGameStore((s) => s.setBoard)
  const setProfile = useGameStore((s) => s.setProfile)
  const setProfileStatus = useGameStore((s) => s.setProfileStatus)
  const [loading, setLoading] = useState(true)
  const [isMerging, setIsMerging] = useState(false)
  const [mergeAnimation, setMergeAnimation] = useState<{
    fromIndex: number
    toIndex: number
    level: number
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    apiFetch<Player>('/player/profile')
      .then((p) => {
        if (!cancelled) {
          setProfile(p)
          setProfileStatus('ready')
        }
      })
      .catch((e) => {
        if (!cancelled) setProfileStatus('error')
        console.error('Failed to fetch profile state:', e)
      })

    apiFetch<BoardResponse>('/board/get-board')
      .then((data) => {
        if (!cancelled) {
          setBoard(normalize(data))
        }
      })
      .catch((e) => {
        console.error('Failed to fetch board state:', e)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleMerge(fromIndex: number, toIndex: number) {
    if (!state || isMerging) return

    const fromCat = state.cells[fromIndex]
    const toCat = state.cells[toIndex]

    if (!fromCat || !toCat || fromCat.unitLevel !== toCat.unitLevel) return

    setIsMerging(true)
    setMergeAnimation({ fromIndex, toIndex, level: toCat.unitLevel })

    try {
      const response = await apiFetch<BoardResponse>('/board/merge', {
        method: 'POST',
        body: JSON.stringify({ fromIndex, toIndex }),
      })
      setTimeout(() => {
        setBoard(normalize(response))
        setMergeAnimation(null)
        setIsMerging(false)
      }, 500)
    } catch (error) {
      setMergeAnimation(null)
      setIsMerging(false)

      const fresh = await apiFetch<BoardResponse>('/board/get-board').catch(
        () => null,
      )
      if (fresh) setBoard(normalize(fresh))
    }
  }

  async function handleMove(fromIndex: number, toIndex: number) {
    if (!state || isMerging) return

    const snapshot = state
    const optimistic = [...state.cells]
    optimistic[toIndex] = optimistic[fromIndex]
    optimistic[fromIndex] = null
    setBoard({ ...state, cells: optimistic })

    try {
      const response = await apiFetch<BoardResponse>('/board/move', {
        method: 'POST',
        body: JSON.stringify({ fromIndex, toIndex }),
      })
      setBoard(normalize(response))
    } catch (error) {
      setBoard(snapshot)
      console.error('Failed to move cat:', error)
    }
  }

  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4">
        <SpawnZone />
        {loading ? (
          <div className="mt-4 text-gray-500">Loading...</div>
        ) : !state ? (
          <div className="mt-4 text-red-500">Не удалось загрузить доску</div>
        ) : (
          <FarmBoard
            // balance={liveBalance}
            // incomeRate={state.incomeRate}
            cells={state.cells}
            onMerge={handleMerge}
            onMove={handleMove}
            cols={4}
            mergeAnimation={mergeAnimation}
          />
        )}
      </main>
      <BottomNav />
    </>
  )
}
