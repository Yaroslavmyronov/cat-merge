// components/shop/ShopModal.tsx
'use client'
import { Modal } from '@/components/ui/Modal'
import { useLiveValue } from '@/hooks/useLiveValue'
import { useShopCats } from '@/hooks/useShopCats'
import { apiFetch } from '@/lib/api/fetchInstance'
import { formatCompact } from '@/lib/formatCompact'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { useShopModalStore } from '@/lib/store/useShopModalStore'
import { BoardResponse } from '@/lib/types/board'
import { useState } from 'react'
import { CatSprite } from './CatSprite'

export const ShopModal = () => {
	const { close, isOpen } = useShopModalStore()
	const { data: catsShop, loading, refresh } = useShopCats(isOpen)
	const { board, setBoard } = useGameStore()
	const [pending, setPending] = useState<number | null>(null)

	const liveBalance = useLiveValue(
		board?.balance ?? 0,
		board?.incomeRate ?? 0,
		board?.serverTime ?? '',
	)

	const handleBuy = async (level: number) => {
		if (pending !== null) return

		setPending(level)
		try {
			const res = await apiFetch<BoardResponse>('/board/buy-unit', {
				method: 'POST',
				body: JSON.stringify({ level }),
			})
			refresh()
			setBoard(normalize(res))
		} catch (error) {
			console.error('Failed to buy cat:', error)
			await refresh()
		} finally {
			setPending(null)
		}
	}

	const balance = board?.balance ?? 0
	const hasFreeSlot = board !== null && board.cells.some((c) => c === null)
	return (
		<Modal isOpen={isOpen} onClose={close}>
			<section
				aria-labelledby="shop-title"
				className="relative flex max-h-[600px] w-[calc(100%-32px)] max-w-[380px] flex-col border-4 border-[#8B5E3C] bg-[#F5E6C8]"
			>
				{/* Header */}
				<header className="relative flex shrink-0 items-center justify-center py-3">
					<h2
						id="shop-title"
						className="border-2 border-[#8B5E3C] bg-[#FFF8E7] px-6 py-1 text-sm font-bold text-[#6B4423]"
					>
						Cat Shop
					</h2>
					<button
						type="button"
						onClick={close}
						aria-label="Close shop"
						className="absolute -right-2 -top-2 h-8 w-8 border-2 border-[#8B2E2E] bg-[#D94545] text-xs font-bold text-white"
					>
						✕
					</button>
				</header>

				<div className="flex shrink-0 items-center justify-start border-2 border-[#D4B896] bg-[#FFF8E7] p-2 mx-3 mb-2">
					<p className="flex items-center gap-1 text-xs font-bold text-[#6B4423]">
						<img src="pixel_coin.png" alt="Coins" className="h-4 w-4" />
						{formatCompact(liveBalance)}
					</p>
				</div>

				<div className="min-h-0 grow overflow-y-auto p-3">
					<ul className="space-y-2">
						{loading && <p>Loading…</p>}
						{catsShop?.map((cat) => {
							const cantAfford = balance < cat.price
							const isPending = pending === cat.level
							const disabled = cantAfford || !hasFreeSlot || pending !== null
							return (
								<li key={cat.level}>
									<article className="relative flex items-center gap-2 border-2 border-[#8B5E3C] bg-[#FFF8E7] p-2 justify-between">
										<div className="relative shrink-0">
											<CatSprite level={cat.level} size={56} />
											<p className="absolute -top-1 right-0 border border-[#8B5E3C] bg-[#FFD54F] px-1.5 text-[9px] font-bold text-[#6B4423]">
												<span className="sr-only">Level</span>
												{cat.level}
											</p>
										</div>

										<div className="flex min-w-0 flex-col items-end gap-1">
											<p className="flex items-center gap-1 text-[10px] text-[#6B4423]">
												Speed
												<span className="border-2 border-[#4CAF50] bg-[#E8F5E9] px-2 py-0.5 font-bold text-[#2E7D32]">
													+{formatCompact(cat.speed)}/s
												</span>
											</p>

											<button
												onClick={() => handleBuy(cat.level)}
												type="button"
												disabled={disabled}
												className="w-[100px] border-2 py-1 text-[11px] font-bold border-[#C68B3C] bg-[#FFD54F] text-[#6B4423]"
											>
												{isPending ? '…' : !hasFreeSlot ? 'No space' : formatCompact(cat.price)}
											</button>
										</div>
									</article>
								</li>
							)
						})}
					</ul>
				</div>
			</section>
		</Modal>
	)
}