import { useDroppable } from '@dnd-kit/react'
import { TrashIcon } from './ui/TrashIcon'

export function TrashZone() {
	const { ref, isDropTarget } = useDroppable({ id: 'trash' })
	return (
		<div>
			<div
				ref={ref}
				aria-label="Delete cat"
				className={`flex h-14 w-14 items-center justify-center border-4 border-[#8B2E2E] text-white transition-all ${isDropTarget ? 'scale-125 bg-[#B83333]' : 'scale-100 bg-[#D94545]'
					}`}
			>
				<TrashIcon className="h-9 w-9" />
			</div>
		</div>
	)
}