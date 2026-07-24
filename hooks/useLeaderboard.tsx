import { apiFetch } from '@/lib/api/fetchInstance'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface TopPlayer {
	address: string
	totalEarned: number
	league: number
}

interface LeaderboardResponse {
	players: TopPlayer[]
	threshold: number
	currentPlayerRank: number | null
	hasMore: boolean
}

export function useLeaderboard(league: string, enabled: boolean, pageSize = 20) {
	const [players, setPlayers] = useState<TopPlayer[]>([])
	const [threshold, setThreshold] = useState<number | null>(null)
	const [currentPlayerRank, setCurrentPlayerRank] = useState<number | null>(null)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const loadingRef = useRef(false)

	const loadPage = useCallback(
		async (p: number) => {
			if (loadingRef.current) return
			loadingRef.current = true
			setLoading(true)

			try {
				const data = await apiFetch<LeaderboardResponse>(`/player/leaderboard?league=${league}&page=${p}&pageSize=${pageSize}`)

				setPlayers((prev) => (p === 1 ? data.players : [...prev, ...data.players]))
				setThreshold(data.threshold)
				setCurrentPlayerRank(data.currentPlayerRank)
				setHasMore(data.hasMore)
				setPage(p)
			} catch (e: any) {
				setError(e)
			} finally {
				loadingRef.current = false
				setLoading(false)
			}
		},
		[league, pageSize],
	)

	useEffect(() => {
		if (!enabled) return
		loadPage(1)
	}, [enabled, loadPage])

	const loadMore = useCallback(() => {
		if (!hasMore || loadingRef.current) return
		loadPage(page + 1)
	}, [hasMore, page, loadPage])

	return { players, threshold, loading, hasMore, loadMore, error, currentPlayerRank }
}