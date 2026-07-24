import { useLeaderboard } from '@/hooks/useLeaderboard'
import { formatCompact } from '@/lib/formatCompact'
import { LeagueType } from '@/lib/types/player'
import { useRef, useState } from 'react'
import { LeagueIcon } from './ui/LeagueIcon'
import { LoadingDots } from './ui/LoadingDots'

export const TopModalContent = ({
	myLeague,
	onClose,
}: {
	myLeague: string
	onClose: () => void
}) => {
	const listRef = useRef<HTMLOListElement>(null)

	const [viewLeague, setViewLeague] = useState<LeagueType>(
		myLeague.toLowerCase() as LeagueType,
	)

	const { players, threshold, loading, hasMore, loadMore } = useLeaderboard(
		viewLeague,
		true,
	)

	const LEAGUES: LeagueType[] = ['bronze', 'silver', 'gold', 'emerald', 'sapphire', 'amethyst']
	const idx = LEAGUES.indexOf(viewLeague)
	const prev = LEAGUES[idx - 1]
	const next = LEAGUES[idx + 1]


	const handleScroll = () => {
		const el = listRef.current
		if (!el) return
		if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) loadMore()
	}

	return (
		<section
			aria-labelledby="top-title"
			className="relative flex h-[560px] w-[320px] flex-col border-4 border-[#8B5E3C] bg-[#F5E6C8]"
		>
			<button
				type="button"
				onClick={onClose}
				aria-label="Close leaderboard"
				className="absolute -right-3 -top-3 z-10 flex h-11 w-11 items-center justify-center border-2 border-[#8B2E2E] bg-[#D94545] text-xs font-bold text-white"
			>
				✕
			</button>

			{/* Заголовок */}
			<header className="flex shrink-0 justify-center pb-2 pt-3">
				<h2
					id="top-title"
					className="border-2 border-[#8B5E3C] bg-[#FFF8E7] px-5 py-1 text-sm font-bold text-[#6B4423]"
				>
					Leaderboard
				</h2>
			</header>

			{/* Текущая лига */}
			<div className="flex shrink-0 flex-col items-center gap-1 pb-3">
				{viewLeague && <LeagueIcon league={viewLeague} />}
				<p className="text-sm font-bold uppercase tracking-wide text-[#8A5A45]">
					{viewLeague ?? '—'}
				</p>
			</div>

			{/* Переключатель периода */}
			<div className="flex shrink-0 items-center justify-center gap-3 pb-3">
				<button
					type="button"
					onClick={() => prev && setViewLeague(prev)}
					disabled={!prev}
					aria-label="Previous league"
					className="flex h-11 w-11 items-center justify-center border-2 border-[#C68B3C] bg-[#FFF8E7] text-[#6B4423] disabled:opacity-30"
				>
					◀
				</button>

				<div className="flex flex-col items-center gap-1">
					<LeagueIcon league={viewLeague} />
					<p className="text-sm font-bold uppercase tracking-wide text-[#8A5A45]">
						{viewLeague}
					</p>
					{threshold !== null && (
						<p className="text-[10px] text-[#A8794C]">from {formatCompact(threshold)}</p>
					)}
				</div>

				<button
					type="button"
					onClick={() => next && setViewLeague(next)}
					disabled={!next}
					aria-label="Next league"
					className="flex h-11 w-11 items-center justify-center border-2 border-[#C68B3C] bg-[#FFF8E7] text-[#6B4423] disabled:opacity-30"
				>
					▶
				</button>
			</div>

			{/* Список */}
			<ol ref={listRef} onScroll={handleScroll} className="min-h-0 grow overflow-y-auto px-3 pb-3">
				{loading && <li className="py-3 text-center"><LoadingDots /></li>}
				{!loading && players.length === 0 && (
					<li className="py-6 text-center text-[11px] text-[#A8794C]">No players yet</li>
				)}
				{players.map((player, i) => {
					const rank = i + 1
					return (
						<li key={player.walletAddress}>
							<article className="mb-1.5 flex items-center gap-2 border-2 border-[#8B5E3C] bg-[#FFF8E7] px-2 py-1.5">
								<span className={`... ${rank === 1 ? 'border-[#B5851A] bg-[#FFD54F] text-[#6B4423]'
									: rank === 2 ? 'border-[#8A8A8A] bg-[#D9D9D9] text-[#4A4A4A]'
										: rank === 3 ? 'border-[#8B5A2B] bg-[#C68B3C] text-white'
											: 'border-[#D4B896] bg-[#F5E6C8] text-[#A8794C]'
									}`}>
									{rank}
								</span>

								<span className="min-w-0 flex-1 truncate text-[11px] font-bold text-[#6B4423]">
									{`${player.walletAddress.slice(0, 6)}…${player.walletAddress.slice(-4)}`}
								</span>

								<span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#8A5A45]">
									<img src="/pixel_coin.png" alt="" className="h-3.5 w-3.5" style={{ imageRendering: 'pixelated' }} />
									{formatCompact(player.totalEarned)}
								</span>
							</article>
						</li>
					)
				})}
			</ol>

			{/* Своя позиция — закреплена внизу */}
		</section>
	)
}