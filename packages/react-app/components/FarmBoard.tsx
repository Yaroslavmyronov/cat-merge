import { DragDropProvider } from '@dnd-kit/react'

import { BoardState } from '@/app/page'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import { PointerSensor } from '@dnd-kit/react'
import { FarmCell } from './FarmCell'
import { FarmStats } from './FarmStats'

interface MergeAnimationState {
	fromIndex: number
	toIndex: number
	level: number
}

interface FarmGridProps {
	cells: BoardState['cells']
	onMerge: (fromIndex: number, toIndex: number) => void
	mergeAnimation: MergeAnimationState | null
	cols: number
	balance: number
	incomeRate: number
}

export function FarmBoard({ cells, onMerge, mergeAnimation, cols, balance, incomeRate }: FarmGridProps) {
	function handleDragEnd(event: any) {
		const { operation, canceled } = event
		if (canceled) return

		const { source, target } = operation
		if (!target) return

		const fromIndex = Number(source.id)
		const toIndex = Number(target.id)
		if (fromIndex === toIndex) return

		onMerge(fromIndex, toIndex)
	}

	return (
		<section style={{ WebkitTouchCallout: 'none' }} className="relative flex w-full select-none flex-col">
			<FarmStats incomePerSecond={incomeRate} currentGold={balance} />
			<div
				style={{ aspectRatio: '936 / 744' }}
				className="relative flex w-full flex-col bg-cover bg-center bg-[url(/pixel_big_carpet.png)]"
			>
				<DragDropProvider sensors={(defaults) => [
					...defaults.filter((sensor) => sensor !== PointerSensor),
					PointerSensor.configure({
						activationConstraints(event) {
							if (event.pointerType === 'touch') {
								return [new PointerActivationConstraints.Distance({ value: 5 })]
							}
							return [new PointerActivationConstraints.Distance({ value: 5 })]
						},
					}),
				]} onDragEnd={handleDragEnd}>
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
									mergeInfo={mergeAnimation?.toIndex === index ? { level: mergeAnimation.level } : null}
								/>
							))}
						</div>
					</div>
				</DragDropProvider>
			</div>
		</section>
	)
}