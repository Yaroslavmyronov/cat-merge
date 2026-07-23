'use client'

import { BottomNav } from '@/components/BottomNav'
import { FarmBoard } from '@/components/FarmBoard'
import { apiFetch } from '@/lib/api/fetchInstance'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardCell, BoardResponse } from '@/lib/types/board'
import { Player } from '@/lib/types/player'
import { useEffect, useRef, useState } from 'react'

export interface BoardState extends Omit<BoardResponse, 'cells'> {
  cells: (BoardCell | null)[]
}

export default function Home() {
  const loadedRef = useRef(false)
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
    if (loadedRef.current) return
    loadedRef.current = true

    apiFetch<Player>('/player/profile')
      .then((p) => {
        setProfile(p)
        setProfileStatus('ready')
        if (!p.bonusClaimAvailable) {
          return apiFetch<BoardResponse>('/board/get-board')
            .then((board) => setBoard(normalize(board)))
            .catch((e) => {
              console.error('Failed to fetch board:', e)
            })
        }
      })
      .catch((e) => {
        setProfileStatus('error')
        console.error('Failed to fetch profile:', e)
      })
      .finally(() => setLoading(false))
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
      <main className="flex flex-1 flex-col items-center justify-end overflow-y-auto px-4 pb-4">
        {loading ? (
          <div
            style={{ aspectRatio: '936 / 744' }}
            className="relative flex w-full flex-col bg-[url(/pixel_big_carpet.png)] bg-cover bg-center"
          >
            <div className="relative bottom-[14px] flex-1 p-4">
              <div className="grid grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="relative flex aspect-square items-end justify-center">
                    <img
                      src="/cat-bed.png"
                      alt=""
                      className="pixel-pulse absolute bottom-0 left-1/2 h-2/5 w-[70%] -translate-x-1/2 object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !state ? (
          <div className="mt-4 text-red-500">Не удалось загрузить доску</div>
        ) : (
          <FarmBoard
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
