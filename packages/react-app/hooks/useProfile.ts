import { apiFetch } from '@/lib/api/fetchInstance'
import { Player } from '@/lib/types/player'
import { useCallback, useEffect, useState } from 'react'

export function useProfile() {
	const [data, setData] = useState<Player | null>(null)
	const [loading, setLoading] = useState(false)

	const refresh = useCallback(async () => {
		try {
			const response = await apiFetch<Player>('/player/profile')
			setData(response)
		} catch (error) {
			console.error('Failed to fetch profile:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		setLoading(true)
		refresh()
	}, [refresh])

	return { data, loading, refresh }
}

