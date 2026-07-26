
import { BoardState } from '@/app/page'
import { FarmCell } from './FarmCell'
import { FarmStats } from './FarmStats'

interface MergeAnimationState {
  fromIndex: number
  toIndex: number
  level: number
}

interface FarmBoardProps {
  cells: BoardState['cells']
  mergeAnimation: MergeAnimationState | null
  cols: number

}

export function FarmBoard({
  cells,
  mergeAnimation,
  cols,
}: FarmBoardProps) {

  return (
    <section
      style={{ WebkitTouchCallout: 'none' }}
      className="relative flex w-full select-none flex-col "
    >
      <FarmStats />
      <div
        style={{ aspectRatio: '936 / 744' }}
        className="relative flex w-full flex-col bg-[url(/pixel_big_carpet.png)] bg-cover bg-center"
      >

        <div className="relative bottom-[14px] flex-1 p-4">
          <div
            role="grid"
            aria-label="Ферма — доска для слияния котов"
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {cells.map((cat, index) => (
              <FarmCell
                key={index}
                index={index}
                cat={cat}
                hidden={mergeAnimation?.fromIndex === index}
                mergeInfo={
                  mergeAnimation?.toIndex === index
                    ? { level: mergeAnimation.level }
                    : null
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
