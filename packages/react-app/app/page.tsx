'use client'

import { BottomNav } from '@/components/BottomNav'
import { FarmBoard } from '@/components/FarmBoard'
import { SpawnZone } from '@/components/SpawnZone'
import { useLiveValue } from '@/hooks/useLiveValue'
import { apiFetch } from '@/lib/api/fetchInstance'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardCell, BoardResponse } from '@/lib/types/board'
import { useEffect, useState } from 'react'

export interface BoardState extends Omit<BoardResponse, 'cells'> {
  cells: (BoardCell | null)[]
}

function normalize(data: BoardResponse): BoardState {
  return {
    ...data,
    cells: [...data.cells]
      .sort((a, b) => a.index - b.index)
      .map((c) => (c.unitLevel > 0 ? c : null)),
  }
}

export default function Home() {
  const { board: state, setBoard } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [isMerging, setIsMerging] = useState(false)
  const [mergeAnimation, setMergeAnimation] = useState<{
    fromIndex: number
    toIndex: number
    level: number
  } | null>(null)

  const liveBalance = useLiveValue(state?.balance ?? 0, state?.incomeRate ?? 0, state?.serverTime ?? '')

  useEffect(() => {
    let cancelled = false

    apiFetch<BoardResponse>('/board/get-board')
      .then((data) => {
        if (!cancelled) {
          setBoard(normalize(data))
        }
      })
      .catch((error) => {
        console.error('Failed to fetch board state:', error)
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

      const fresh = await apiFetch<BoardResponse>('/board/get-board').catch(() => null)
      if (fresh) setBoard(normalize(fresh))
    }
  }

  return (
    <>
      <main className="flex flex-1 flex-col overflow-y-auto items-center justify-center px-4">
        <SpawnZone />
        {loading ? (
          <div className="mt-4 text-gray-500">Loading...</div>
        ) : !state ? (
          <div className="mt-4 text-red-500">Не удалось загрузить доску</div>
        ) : (
          <FarmBoard
            balance={liveBalance}
            incomeRate={state.incomeRate}
            cells={state.cells}
            onMerge={handleMerge}
            cols={4}
            mergeAnimation={mergeAnimation}
          />
        )}
      </main>
      <BottomNav />
    </>
  )
}