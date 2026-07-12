'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { UserRejectedRequestError } from 'viem'
import { celoAlfajores } from 'viem/chains'
import { createSiweMessage } from 'viem/siwe'
import { useAccount, useSignMessage } from 'wagmi'

import { apiFetch } from '@/lib/api/fetchInstance'
import { useGameStore } from '@/lib/store/useGameStore'

type AuthState = {
	status: 'idle' | 'signing' | 'verifying'
	errorMessage?: string
	nonce?: string
}

export const useEthereumAuth = () => {
	const { address } = useAccount()
	const { signMessageAsync } = useSignMessage()
	const { setAuthStatus } = useGameStore()
	const [{ status, ...state }, setState] = useState<AuthState>({
		status: 'idle',
	})

	const onceRef = useRef(false)
	const getNonce = useCallback(async () => {
		try {
			const data = await apiFetch<{ nonce: string }>('/auth/nonce')
			setState((x) => ({ ...x, nonce: data.nonce }))
		} catch {
			setState((x) => ({
				...x,
				errorMessage: 'Failed to prepare authentication',
				status: 'idle',
			}))
			toast.error('Failed to prepare authentication')
		}
	}, [])

	useEffect(() => {
		if (onceRef.current) return
		onceRef.current = true
		getNonce()
	}, [getNonce])

	const signIn = useCallback(async () => {
		try {
			if (!address || !state.nonce) {
				return
			}
			if (typeof window === 'undefined' || !window.ethereum) {
				return
			}

			setState((x) => ({
				...x,
				errorMessage: undefined,
				status: 'signing',
			}))

			const message = createSiweMessage({
				domain: window.location.host,
				address,
				statement: 'Sign in with Ethereum to the app.',
				uri: window.location.origin,
				version: '1',
				chainId: celoAlfajores.id,
				nonce: state.nonce,
			})

			let signature: string

			try {
				signature = await signMessageAsync({ message })
			} catch (error) {
				// If the user canceled the signature - this is not an error
				if (error instanceof UserRejectedRequestError) {
					toast.error('Signature request was rejected by user')
					return setState((x) => ({
						...x,
						status: 'idle',
					}))
				}

				toast.error('Failed to sign message')
				return setState((x) => ({
					...x,
					errorMessage: 'Failed to sign message',
					status: 'idle',
				}))
			}

			setState((x) => ({ ...x, status: 'verifying' }))

			try {
				await apiFetch('/auth/verify', {
					method: 'POST',
					body: JSON.stringify({ address, message, signature }),
				})
				setAuthStatus('authenticated')
				return true
			} catch {
				toast.error('Failed to verify signature')
				setAuthStatus('unauthenticated')
				return setState((x) => ({
					...x,
					errorMessage: 'Failed to verify signature',
					status: 'idle',
				}))
			}
		} catch (error) {
			toast.error('An unexpected error occurred')
			setState({
				errorMessage: 'An unexpected error occurred',
				status: 'idle',
			})
		}
	}, [address, state.nonce, setAuthStatus])

	const signOut = useCallback(async () => {
		try {
			await apiFetch('/auth/logout')
		} catch (e) {
			console.error('Logout error:', e)
		}
		setAuthStatus('unauthenticated')
	}, [setAuthStatus])

	return {
		signIn,
		signOut,
		status,
		errorMessage: state.errorMessage,
		nonce: state.nonce,
	}
}