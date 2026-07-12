// components/AuthGate.tsx
'use client'


import { useEthereumAuth } from '@/lib/auth/signMessage'
import { useGameStore } from '@/lib/store/useGameStore'

export function AuthGate({ children }: { children: React.ReactNode }) {
	const { authStatus } = useGameStore()
	const { signIn, status, errorMessage } = useEthereumAuth()

	if (authStatus === 'authenticated') {
		return <>{children}</>
	}

	if (status === 'signing' || status === 'verifying') {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<p>{status === 'signing' ? 'Sign the message in the wallet...' : 'Verifying...'}</p>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 bg-white">
			<h1 className="text-2xl font-bold">Cat Merge Game</h1>
			<p className="text-center text-sm text-gray-600">
				Merge cats, earn gold, and climb the rankings.
			</p>

			{errorMessage && (
				<p className="text-sm text-red-500">
					{status === 'idle' && errorMessage ? 'Login cancelled. Try again.' : errorMessage}
				</p>
			)}

			<button
				onClick={signIn}
				className="rounded-lg bg-[#7EB84A] px-8 py-3 font-bold text-white"
			>
				Play Now
			</button>
		</div>
	)
}