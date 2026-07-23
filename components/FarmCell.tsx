import { useDraggable, useDroppable } from '@dnd-kit/react'

import { BoardCell } from '@/lib/types/board'
import { CatSprite } from './CatSprite'
import { MergeAnimation } from './MergeAnimation'

export function FarmCell({
  index,
  cat,
  hidden,
  mergeInfo,
}: {
  index: number
  cat: BoardCell | null
  hidden: boolean
  mergeInfo: { level: number } | null
}) {
  const { ref: dropRef, isDropTarget } = useDroppable({ id: index })
  const showCat = cat && !hidden && !mergeInfo
  const { ref: dragRef, isDragging } = useDraggable({
    id: index,
    disabled: !cat || hidden,
  })

  return (
    <div
      ref={dropRef}
      role="gridcell"
      aria-label={cat ? `Кот уровня ${cat.unitLevel}` : 'Пустая клетка'}
      className={`relative flex aspect-square items-end justify-center rounded ${isDropTarget ? 'bg-yellow-200/30' : ''
        }`}
    >
      {cat && !isDragging && !hidden && !mergeInfo && (
        <div className="pointer-events-none absolute left-[80%] top-0 z-10 flex h-[22px] w-[22px] -translate-x-1/2 items-center justify-center border-[2px] border-[#8A6D12] bg-[#F5E9D3] text-[8px] font-bold text-[#5C4A1E]">
          {cat?.unitLevel}
        </div>
      )}

      <img
        src="/cat-bed.png"
        alt=""
        className="pointer-events-none absolute bottom-0 left-1/2 h-2/5 w-[70%] -translate-x-1/2 object-contain"
        style={{ imageRendering: 'pixelated' }}
      />

      {showCat && (
        <div
          ref={dragRef}
          style={{ touchAction: 'none' }}
          className="absolute inset-0"
        >
          <div
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="absolute bottom-[14px] left-[55%] -translate-x-1/2"
          >
            <CatSprite level={cat.unitLevel} size={50} />
          </div>
        </div>
      )}

      {mergeInfo && <MergeAnimation level={mergeInfo.level} />}
    </div>
  )
}
