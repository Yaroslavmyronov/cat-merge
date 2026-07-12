'use client'

import { useEthereumAuth } from '@/lib/auth/signMessage'
import { useGameStore } from '@/lib/store/useGameStore'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export function AuthGate({ children }: { children: React.ReactNode }) {
	const { authStatus } = useGameStore()
	const { address } = useAccount()
	const { signIn, status, errorMessage } = useEthereumAuth()

	if (authStatus === 'authenticated') {
		return <>{children}</>
	}

	if (status === 'signing' || status === 'verifying') {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<p>{status === 'signing' ? 'Sign the message in your wallet...' : 'Verifying...'}</p>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
			<h1 className="text-2xl font-bold">Cat Merge Game</h1>
			<p className="text-center text-sm text-gray-600">
				Merge cats, earn gold, and climb the rankings.
			</p>

			{errorMessage && (
				<p className="text-sm text-red-500">{errorMessage}</p>
			)}

			{!address && <ConnectButton />}

			{address && (
				<button
					onClick={signIn}
					className="rounded-lg bg-[#7EB84A] px-8 py-3 font-bold text-white"
				>
					Play Now
				</button>
			)}
		</div>
	)
}