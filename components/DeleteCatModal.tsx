import { BoardCell } from '@/lib/types/board'
import { CatSprite } from './CatSprite'
import { Modal } from './ui/Modal'

interface DeleteCatModalProps {
	cat: BoardCell | null
	isOpen: boolean
	onCancel: () => void
	onConfirm: () => void
}

export const DeleteCatModal = ({
	cat,
	isOpen,
	onCancel,
	onConfirm,
}: DeleteCatModalProps) => {
	return (
		<Modal isOpen={isOpen}>
			<section className="flex w-[280px] flex-col border-4 border-[#8B5E3C] bg-[#F5E6C8] p-4">
				<h2 className="mb-3 text-center text-sm font-bold text-[#6B4423]">
					Delete this cat?
				</h2>

				{cat && (
					<div className="mb-3 flex justify-center">
						<CatSprite level={cat.unitLevel} size={56} />
					</div>
				)}

				<p className="mb-4 text-center text-[11px] text-[#A8794C]">
					Level {cat?.unitLevel} cat will be gone forever
				</p>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 border-2 border-[#C68B3C] bg-[#FFF8E7] py-2 text-xs font-bold text-[#6B4423]"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="flex-1 border-2 border-[#8B2E2E] bg-[#D94545] py-2 text-xs font-bold text-white"
					>
						Delete
					</button>
				</div>
			</section>
		</Modal >
	)
}