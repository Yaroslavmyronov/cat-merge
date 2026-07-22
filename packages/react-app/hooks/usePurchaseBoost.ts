import { CUSD_MAINNET, EventType, MERGE_CAT_ADDRESS } from '@/lib/contracts/mergeCat'
import { getParsedError } from '@/lib/getParsedError'
import { MergeCatABI } from '@/MergeCat'
import { config } from '@/providers/AppProvider'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { erc20Abi } from 'viem'
import { useAccount } from 'wagmi'
import { getChainId, readContract, switchChain, waitForTransactionReceipt, writeContract } from 'wagmi/actions'
import { celo } from 'wagmi/chains'

type Step = 'idle' | 'approving' | 'purchasing' | 'confirming'

export function usePurchaseBoost() {
	const { address } = useAccount()
	const [step, setStep] = useState<Step>('idle')
	const [pendingType, setPendingType] = useState<EventType | null>(null)
	const [error, setError] = useState<string | null>(null)

	const buy = async (eventType: EventType) => {
		setError(null)
		if (!address) {
			setError('Connect your wallet')
			return false
		}
		setPendingType(eventType)
		try {
			const chainId = getChainId(config)
			if (chainId !== celo.id) {
				await switchChain(config, { chainId: celo.id })
			}

			const price = await readContract(config, {
				address: MERGE_CAT_ADDRESS,
				abi: MergeCatABI,
				functionName: 'priceOf',
				args: [CUSD_MAINNET, eventType],
			})

			const balance = await readContract(config, {
				address: CUSD_MAINNET,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [address],
			})

			if (balance < price) {
				setError('Not enough cUSD')
				return false
			}

			const allowance = await readContract(config, {
				address: CUSD_MAINNET,
				abi: erc20Abi,
				functionName: 'allowance',
				args: [address, MERGE_CAT_ADDRESS],
			})

			if (allowance < price) {
				setStep('approving')
				const approveHash = await writeContract(config, {
					address: CUSD_MAINNET,
					abi: erc20Abi,
					functionName: 'approve',
					args: [MERGE_CAT_ADDRESS, price],
				})
				await waitForTransactionReceipt(config, { hash: approveHash })
			}

			setStep('purchasing')
			const buyHash = await writeContract(config, {
				address: MERGE_CAT_ADDRESS,
				abi: MergeCatABI,
				functionName: 'purchase',
				args: [CUSD_MAINNET, eventType],
			})

			setStep('confirming')
			await waitForTransactionReceipt(config, { hash: buyHash })
			toast.success('Boost activated!')
			return true
		} catch (e) {
			setError(getParsedError(e))
			return false
		} finally {
			setStep('idle')
			setPendingType(null)
		}
	}

	return { buy, step, error, pendingType }
}