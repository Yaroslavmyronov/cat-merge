'use client'

import { useEthereumAuth } from '@/lib/auth/signMessage'
import { useGameStore } from '@/lib/store/useGameStore'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
export function AuthGate({ children }: { children: React.ReactNode }) {
	const [hasMounted, setHasMounted] = useState(false)
	const { authStatus } = useGameStore()
	const { address } = useAccount()
	const { signIn, status, errorMessage, nonce } = useEthereumAuth()

	useEffect(() => {
		setHasMounted(true)
	}, [])

	// Пока компонент не "смонтировался" на клиенте — не рендерим ничего специфичного,
	// чтобы избежать рассинхрона между сервером и клиентом
	if (!hasMounted) {
		return null // или простой лоадер без сложной логики
	}

	if (authStatus === 'authenticated') {
		return <>{children}</>
	}

	if (status === 'signing' || status === 'verifying') {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4">
				<p>{status === 'signing' ? 'Подпишите сообщение в кошельке...' : 'Проверяем...'}</p>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
			<h1 className="text-2xl font-bold">🐱 Cat Merge Game</h1>
			<p className="text-center text-sm text-gray-600">
				Сливай котиков, зарабатывай золото, поднимайся в рейтинге
			</p>
			{errorMessage && (
				<p className="text-sm text-red-500">{errorMessage}</p>
			)}

			{/* Если кошелёк ещё не подключён вообще (тестирование в обычном браузере) — показываем кнопку RainbowKit */}
			{!address && <ConnectButton />}

			{/* Если адрес уже есть (подключён через MiniPay или через кнопку выше) — показываем "Играть" */}
			{address && (
				<button
					onClick={() => {
						toast(`address: ${address ?? 'НЕТ'}\nnonce: ${nonce ?? 'НЕТ'}\nstatus: ${status}`, {
							duration: 6000,
						})
						signIn()
					}}
					className="rounded-lg bg-[#7EB84A] px-8 py-3 font-bold text-white"
				>
					Играть
				</button>
			)}
		</div>
	)
}