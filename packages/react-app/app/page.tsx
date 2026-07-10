'use client'

import { BottomNav } from '@/components/BottomNav'
import { FarmBoard } from '@/components/FarmBoard'
import { SpawnZone } from '@/components/SpawnZone'
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react'

interface CatInstance {
  id: string
  level: number
}

const MOCK_BOARD: (CatInstance | null)[] = [
  { id: '1', level: 1 },
  { id: '2', level: 1 },
  { id: '3', level: 1 },
  { id: '4', level: 1 },
  { id: '5', level: 1 },
  { id: '6', level: 1 },
  { id: '7', level: 1 },
  { id: '8', level: 1 },
  { id: '9', level: 1 },
  { id: '10', level: 1 },
  { id: '11', level: 1 },
  { id: '12', level: 999 },
]

export default function Home() {
  const [mergeAnimation, setMergeAnimation] = useState<{
    fromIndex: number
    toIndex: number
    level: number
  } | null>(null)
  const [board, setBoard] = useState<(CatInstance | null)[]>(MOCK_BOARD)
  function handleMerge(fromIndex: number, toIndex: number) {
    const fromCat = board[fromIndex]
    const toCat = board[toIndex]

    if (!fromCat || !toCat || fromCat.level !== toCat.level) return

    // НЕ трогаем board вообще — только запускаем анимацию
    setMergeAnimation({ fromIndex, toIndex, level: toCat.level })

    setTimeout(() => {
      setBoard((prev) => {
        const next = [...prev]
        next[fromIndex] = null
        next[toIndex] = { id: crypto.randomUUID(), level: toCat.level + 1 }
        return next
      })
      setMergeAnimation(null)
    }, 500) // подбери под длительность анимации
  }


  return (
    <>
      <main className="flex flex-1 flex-col overflow-y-auto items-center justify-center px-4">
        <SpawnZone></SpawnZone>
        <FarmBoard
          board={board}
          onMerge={handleMerge}
          cols={4}
          mergeAnimation={mergeAnimation}
        />
        {/* {!address && (
          <div className="h1">Please install Metamask and connect.</div>
        )}
        {address && (
          <div className="h1">
            There you go... a canvas for your next Minipay project!
          </div>
        )} */}
      </main>
      <BottomNav></BottomNav>
    </>
  )
}
