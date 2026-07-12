'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { Address } from 'viem'

import { apiFetch } from '@/lib/api/fetchInstance'
import { useGameStore } from '@/lib/store/useGameStore'

export const SessionChecker = ({ children }: { children: ReactNode }) => {
	const fetchingStatusRef = useRef(false)
	const { setAuthStatus } = useGameStore()

	useEffect(() => {
		const fetchStatus = async () => {
			if (fetchingStatusRef.current) {
				return
			}
			fetchingStatusRef.current = true
			try {
				const data = await apiFetch<{ address?: Address }>('/auth/me')
				console.log('SessionChecker: /auth/me response:', data.address)
				setAuthStatus(data.address ? 'authenticated' : 'unauthenticated')
			} catch (_error) {
				console.error(_error)
				setAuthStatus('unauthenticated')
			} finally {
				fetchingStatusRef.current = false
			}
		}
		fetchStatus()
		window.addEventListener('focus', fetchStatus)
		return () => window.removeEventListener('focus', fetchStatus)
	}, [])

	return <>{children}</>
}