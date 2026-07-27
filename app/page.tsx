'use client'

import { BottomNav } from '@/components/BottomNav'
import { DeleteCatModal } from '@/components/DeleteCatModal'
import { FarmBoard } from '@/components/FarmBoard'
import { TrashZone } from '@/components/TrashZone'
import { useBoardActions } from '@/hooks/useBoardActions'
import { useGameData } from '@/hooks/useGameData'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardCell, BoardResponse } from '@/lib/types/board'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import { DragDropProvider, PointerSensor } from '@dnd-kit/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

export interface BoardState extends Omit<BoardResponse, 'cells'> {
  cells: (BoardCell | null)[]
}

export default function Home() {
  useGameData()
  const board = useGameStore((s) => s.board)
  const boardStatus = useGameStore((s) => s.boardStatus)
  const [isDragging, setIsDragging] = useState(false)

  const {
    merge,
    move,
    requestDelete,
    cancelDelete,
    confirmDelete,
    mergeAnimation,
    pendingDelete,
    catToDelete,
  } = useBoardActions()

  function handleDragEnd(event: any) {
    setIsDragging(false)

    const { operation, canceled } = event
    if (canceled) return

    const { source, target } = operation
    if (!target || !board) return

    const fromIndex = Number(source.id)

    if (target.id === 'trash') {
      requestDelete(fromIndex)
      return
    }

    const toIndex = Number(target.id)
    if (fromIndex === toIndex) return

    const fromCat = board.cells[fromIndex]
    const toCat = board.cells[toIndex]
    if (!fromCat) return

    if (toCat === null) {
      move(fromIndex, toIndex)
    } else if (toCat.unitLevel === fromCat.unitLevel) {
      merge(fromIndex, toIndex)
    }
  }

  return (
    <DragDropProvider
      sensors={(defaults) => [
        ...defaults.filter((sensor) => sensor !== PointerSensor),
        PointerSensor.configure({
          activationConstraints() {
            return [new PointerActivationConstraints.Distance({ value: 5 })]
          },
        }),
      ]}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      <main className="flex flex-1 flex-col items-center justify-end overflow-y-auto px-4 pb-4">
        {board ? (
          <FarmBoard
            cells={board.cells}
            cols={4}
            mergeAnimation={mergeAnimation}
          />
        ) : boardStatus === 'error' ? (
          <div className="mt-4 text-red-500">Failed to load board</div>
        ) : (
          <div
            style={{ aspectRatio: '936 / 744' }}
            className="relative flex w-full flex-col bg-[url(/pixel_big_carpet.png)] bg-cover bg-center"
          >
            <div className="relative bottom-[14px] flex-1 p-4">
              <div className="grid grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative flex aspect-square items-end justify-center"
                  >
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
        )}
      </main>

      <div className="relative min-h-[95px] shrink-0 overflow-hidden">
        <AnimatePresence initial={false}>
          {isDragging ? (
            <motion.div
              key="trash"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <TrashZone />
            </motion.div>
          ) : (
            <motion.div
              key="nav"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
            >
              <BottomNav />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteCatModal
        cat={catToDelete}
        isOpen={pendingDelete !== null}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </DragDropProvider>
  )
}