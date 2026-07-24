import { apiFetch } from '@/lib/api/fetchInstance'
import { useCallback, useEffect, useState } from 'react'

export interface TopPlayer {
	walletAddress: string
	totalEarned: number
	league: string
}

interface LeaderboardResponse {
	players: TopPlayer[]
	threshold: number
	hasMore: boolean
}

export function useLeaderboard(league: string, enabled: boolean, pageSize = 20) {
	const [players, setPlayers] = useState<TopPlayer[]>([])
	const [threshold, setThreshold] = useState<number | null>(null)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loadPage = useCallback(
		async (p: number) => {
			setLoading(true)

			try {
				const data = await apiFetch<LeaderboardResponse>(`/player/leaderboard?league=${league}&page=${p}&pageSize=${pageSize}`)

				setPlayers((prev) => (p === 1 ? data.players : [...prev, ...data.players]))
				setThreshold(data.threshold)
				setHasMore(data.hasMore)
				setPage(p)
			} catch (e) {
				setError(e)
			} finally {
				setLoading(false)
			}
		},
		[league, pageSize],
	)

	useEffect(() => {
		if (!enabled) return
		loadPage(1)
	}, [enabled, loadPage])

	const loadMore = () => {
		if (!hasMore) return
		loadPage(page + 1)
	}

	return { players, threshold, loading, hasMore, loadMore, error }
}