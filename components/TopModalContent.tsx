import { useLeaderboard } from '@/hooks/useLeaderboard'
import { formatCompact } from '@/lib/formatCompact'
import { useGameStore } from '@/lib/store/useGameStore'
import { LeagueType } from '@/lib/types/player'
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { LeagueIcon } from './ui/LeagueIcon'
import { LoadingDots } from './ui/LoadingDots'

const LEAGUES: LeagueType[] = ['bronze', 'silver', 'gold', 'emerald', 'sapphire', 'amethyst']

export const TopModalContent = ({
	myLeague,
	close,
}: {
	myLeague: string
	close: () => void
}) => {
	const [viewLeague, setViewLeague] = useState<LeagueType>(
		myLeague.toLowerCase() as LeagueType,
	)

	const { address } = useAccount()
	const myTotalEarned = useGameStore((s) => s.profile?.totalEarned ?? 0)

	const {
		players,
		threshold,
		currentPlayerRank,
		loading,
		hasMore,
		loadMore,
	} = useLeaderboard(viewLeague, true)

	const listRef = useRef<HTMLOListElement>(null)
	const sentinelRef = useRef<HTMLLIElement>(null)

	const idx = LEAGUES.indexOf(viewLeague)
	const prev = LEAGUES[idx - 1]
	const next = LEAGUES[idx + 1]

	const isMeInList = players.some(
		(p) => p.address.toLowerCase() === address?.toLowerCase(),
	)

	useEffect(() => {
		const el = sentinelRef.current
		if (!el || !hasMore) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore()
			},
			{ root: listRef.current, rootMargin: '100px' },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [hasMore, loadMore])

	useEffect(() => {
		listRef.current?.scrollTo({ top: 0 })
	}, [viewLeague])

	return (
		<section
			aria-labelledby="top-title"
			className="relative flex h-[560px] w-[320px] flex-col border-4 border-[#8B5E3C] bg-[#F5E6C8]"
		>
			<button
				type="button"
				onClick={close}
				aria-label="Close top"
				className="absolute -right-3 -top-3 h-8 w-8 border-2 border-[#8B2E2E] bg-[#D94545] text-xs font-bold text-white"
			>
				✕
			</button>
			<header className="flex shrink-0 justify-center py-3">
				<h2
					id="top-title"
					className="border-2 border-[#8B5E3C] bg-[#FFF8E7] px-5 py-1 text-sm font-bold text-[#6B4423]"
				>
					Leaderboard
				</h2>
			</header>
			<div className="flex items-center justify-center pb-3">
				<button
					type="button"
					onClick={() => prev && setViewLeague(prev)}
					disabled={!prev}
					aria-label="Previous league"
					className="flex h-11 w-11 items-center justify-center text-[#6B4423] disabled:opacity-30 text-2xl"
				>
					◀
				</button>
				<div className="flex flex-col items-center gap-1 min-w-[140px]">
					<LeagueIcon size={100} league={viewLeague} />
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
					className="flex h-11 w-11 items-center justify-center text-[#6B4423] disabled:opacity-30 text-2xl"
				>
					▶
				</button>
			</div>
			<ol ref={listRef} className="min-h-0 grow overflow-y-auto px-3 pb-3">
				{loading && players.length === 0 && (
					<li className="py-3 text-center h-full flex justify-center items-center text-[#A8794C]">
						<LoadingDots />
					</li>
				)}
				{!loading && players.length === 0 && (
					<li className="py-6 text-center text-[11px] text-[#A8794C] h-full flex justify-center items-center">
						No players yet
					</li>
				)}
				{players.map((player, i) => {
					const rank = i + 1
					const isMe = address?.toLowerCase() === player.address.toLowerCase()
					return (
						<li key={player.address}>
							<article className={`mb-1.5 flex items-center gap-2 border-2 ${isMe
								? 'border-[#C68B3C] bg-[#FFF4DC]'
								: 'border-[#8B5E3C] bg-[#FFF8E7]'} bg-[#FFF8E7] px-2 py-1.5`}>
								<span className='text-[#A8794C]'>
									{rank}
								</span>
								<span className="min-w-0 flex-1 truncate text-[11px] font-bold text-[#6B4423]">
									{isMe
										? 'You'
										: `${player.address.slice(0, 6)}…${player.address.slice(-4)}`}
								</span>
								<span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#8A5A45]">
									<img src="/pixel_coin.png" alt="" className="h-3.5 w-3.5" style={{ imageRendering: 'pixelated' }} />
									{formatCompact(player.totalEarned)}
								</span>
							</article>
						</li>
					)
				})}
				{loading && players.length > 0 && (
					<li className="py-3 text-center text-[#A8794C]">
						<LoadingDots />
					</li>
				)}
				{hasMore && <li ref={sentinelRef} className="h-4" />}
			</ol>
			{currentPlayerRank !== null && !isMeInList && (
				<div className="shrink-0 border-t-2 border-[#D4B896] bg-[#F0DFC0] px-3 py-2">
					<article className="flex items-center gap-2 border-2 border-[#C68B3C] bg-[#FFF8E7] px-2 py-1.5">
						<span className="flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold text-[#A8794C]">
							{currentPlayerRank}
						</span>
						<span className="min-w-0 flex-1 text-[11px] font-bold text-[#6B4423]">You</span>
						<span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#8A5A45]">
							<img src="/pixel_coin.png" alt="" className="h-3.5 w-3.5" style={{ imageRendering: 'pixelated' }} />
							{formatCompact(myTotalEarned)}
						</span>
					</article>
				</div>
			)}
		</section>
	)
}