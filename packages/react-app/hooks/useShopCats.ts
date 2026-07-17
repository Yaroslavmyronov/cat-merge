import { apiFetch } from '@/lib/api/fetchInstance'
import { CatPrice } from '@/lib/types/board'
import { useCallback, useEffect, useState } from 'react'

export function useShopCats(enabled: boolean) {
	const [data, setData] = useState<CatPrice[] | null>(null)
	const [loading, setLoading] = useState(false)

	const refresh = useCallback(async () => {
		setLoading(true)
		try {
			const response = await apiFetch<CatPrice[]>('/board/get-prices')
			setData(response)
		} catch (error) {
			console.error('Failed to fetch board prices:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		if (!enabled) return
		refresh()
	}, [enabled, refresh])

	return { data, loading, refresh }
}