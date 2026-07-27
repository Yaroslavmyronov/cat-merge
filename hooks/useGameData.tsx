import { apiFetch } from '@/lib/api/fetchInstance'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardResponse } from '@/lib/types/board'
import { Player } from '@/lib/types/player'
import { useEffect, useRef, useState } from 'react'

export function useGameData() {
	const setBoard = useGameStore((s) => s.setBoard)
	const setProfile = useGameStore((s) => s.setProfile)
	const setProfileStatus = useGameStore((s) => s.setProfileStatus)
	const [loading, setLoading] = useState(true)
	const loadedRef = useRef(false)

	useEffect(() => {
		if (loadedRef.current) return
		loadedRef.current = true

		apiFetch<Player>('/player/profile')
			.then((p) => {
				setProfile(p)
				setProfileStatus('ready')
				if (!p.bonusClaimAvailable) {
					return apiFetch<BoardResponse>('/board/get-board')
						.then((board) => setBoard(normalize(board)))
						.catch((e) => {
							console.error('Failed to fetch board:', e)
						})
				}
			})
			.catch((e) => {
				setProfileStatus('error')
				console.error('Failed to fetch profile:', e)
			})
			.finally(() => setLoading(false))
	}, [])

	return { loading }
}