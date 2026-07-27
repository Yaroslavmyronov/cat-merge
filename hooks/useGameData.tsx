import { apiFetch } from '@/lib/api/fetchInstance'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardResponse } from '@/lib/types/board'
import { Player } from '@/lib/types/player'
import { useEffect, useRef } from 'react'

export function useGameData() {
	const setBoard = useGameStore((s) => s.setBoard)
	const setProfile = useGameStore((s) => s.setProfile)
	const setProfileStatus = useGameStore((s) => s.setProfileStatus)
	const setBoardStatus = useGameStore((s) => s.setBoardStatus)
	const loadedRef = useRef(false)

	useEffect(() => {
		if (loadedRef.current) return
		loadedRef.current = true

		apiFetch<Player>('/player/profile')
			.then((profile) => {
				setProfile(profile)
				setProfileStatus('ready')

				if (profile.bonusClaimAvailable) {
					setBoardStatus('idle')
					return
				}

				return apiFetch<BoardResponse>('/board/get-board')
					.then((board) => {
						setBoard(normalize(board))
						setBoardStatus('ready')
					})
					.catch((e) => {
						setBoardStatus('error')
						console.error('Failed to fetch board:', e)
					})
			})
			.catch((e) => {
				setProfileStatus('error')
				setBoardStatus('error')
				console.error('Failed to fetch profile:', e)
			})
	}, [])
}