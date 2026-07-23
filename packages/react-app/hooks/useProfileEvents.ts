import { apiFetch } from '@/lib/api/fetchInstance'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardResponse } from '@/lib/types/board'
import { Player } from '@/lib/types/player'
import { useEffect } from 'react'

export function useProfileEvents() {
	const setAwaitingPurchase = useGameStore((s) => s.setAwaitingPurchase)
	const setProfile = useGameStore((s) => s.setProfile)
	const setBoard = useGameStore((s) => s.setBoard)
	const authStatus = useGameStore((s) => s.authStatus)

	useEffect(() => {
		if (authStatus !== 'authenticated') return

		const es = new EventSource(
			`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/stream`,
			{ withCredentials: true },
		)

		es.addEventListener('purchase', async () => {
			try {
				const wasBonusAvailable = useGameStore.getState().profile?.bonusClaimAvailable

				const fresh = await apiFetch<Player>('/player/profile')
				setProfile(fresh)

				if (wasBonusAvailable && !fresh.bonusClaimAvailable) {
					const board = await apiFetch<BoardResponse>('/board/get-board')
					setBoard(normalize(board))
				}
			} catch (e) {
				console.error('Failed to refresh after purchase:', e)
			} finally {
				setAwaitingPurchase(false)
			}
		})

		es.onerror = () => {
			console.warn('SSE connection issue, reconnecting…')
		}

		return () => es.close()
	}, [setProfile, authStatus])
}