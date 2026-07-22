import { apiFetch } from '@/lib/api/fetchInstance'
import { useGameStore } from '@/lib/store/useGameStore'
import { Player } from '@/lib/types/player'
import { useEffect } from 'react'

export function useProfileEvents() {
	const setAwaitingPurchase = useGameStore((s) => s.setAwaitingPurchase)
	const setProfile = useGameStore((s) => s.setProfile)
	const authStatus = useGameStore((s) => s.authStatus)

	useEffect(() => {
		if (authStatus !== 'authenticated') return

		const es = new EventSource(
			`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/stream`,
			{ withCredentials: true },
		)

		es.addEventListener('purchase', async () => {
			const fresh = await apiFetch<Player>('/player/profile')
			setProfile(fresh)
			setAwaitingPurchase(false)
		})

		es.onerror = () => {
			console.warn('SSE connection issue, reconnecting…')
		}

		return () => es.close()
	}, [setProfile, authStatus])
}