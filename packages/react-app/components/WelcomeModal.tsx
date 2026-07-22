'use client'
import { Modal } from '@/components/ui/Modal'
import { usePurchase } from '@/hooks/usePurchase'
import { apiFetch } from '@/lib/api/fetchInstance'
import { CUSD_MAINNET, EventType, MERGE_CAT_ADDRESS } from '@/lib/contracts/mergeCat'
import { formatAway } from '@/lib/formatAway'
import { formatCompact } from '@/lib/formatCompact'
import { useGameStore } from '@/lib/store/useGameStore'
import { useWelcomeModalStore } from '@/lib/store/useWelcomeModalStore'
import { Player } from '@/lib/types/player'
import { MergeCatABI } from '@/MergeCat'
import { useEffect, useRef, useState } from 'react'
import { formatUnits } from 'viem'
import { useReadContract } from 'wagmi'
import { LoadingDots } from './ui/LoadingDots'

export const WelcomeModal = () => {
  const { close, isOpen, open } = useWelcomeModalStore()
  const { buy, step, error, pendingType } = usePurchase()
  const [pending, setPending] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const bonusClaimAvailable = useGameStore((s) => s.profile?.bonusClaimAvailable)
  const setAwaitingPurchase = useGameStore((s) => s.setAwaitingPurchase)
  const setProfile = useGameStore((s) => s.setProfile)
  const claimableGold = useGameStore((s) => s.profile?.claimableGold ?? 0)
  const lastCollectedAt = useGameStore((s) => s.profile?.lastCollectedAt)

  const awayText = lastCollectedAt
    ? formatAway(Date.now() - new Date(lastCollectedAt).getTime())
    : ''

  const { data: rewardPrice } = useReadContract({
    address: MERGE_CAT_ADDRESS,
    abi: MergeCatABI,
    functionName: 'priceOf',
    args: [CUSD_MAINNET, EventType.OfflineReward],
    query: { enabled: true },
  })

  console.log(rewardPrice)

  const shownRef = useRef(false)

  const handleClaim = async () => {
    if (pending) return
    setPending(true)

    try {
      const fresh = await apiFetch<Player>('/player/collect', { method: 'POST' })
      setProfile(fresh)
      close()
    } catch (e) {
      setClaimError('Failed to collect, try again')
    } finally {
      setPending(false)
    }
  }

  const handleClaimX2 = async () => {
    const ok = await buy(EventType.OfflineReward)
    if (!ok) return
    setAwaitingPurchase(true)
  }

  useEffect(() => {
    if (shownRef.current) return
    if (!bonusClaimAvailable) return
    shownRef.current = true
    open()
  }, [bonusClaimAvailable, open])

  return (
    <Modal isOpen={true} onClose={close}>
      <section
        aria-labelledby="welcome-title"
        className="relative flex w-[300px] flex-col border-4 border-[#8B5E3C] bg-[#F5E6C8]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute -right-3 -top-3 z-10 h-8 w-8 border-2 border-[#8B2E2E] bg-[#D94545] text-xs font-bold text-white"
        >
          ✕
        </button>

        <header className="flex justify-center pb-2 pt-3">
          <h2
            id="welcome-title"
            className="border-2 border-[#8B5E3C] bg-[#FFF8E7] px-5 py-1 text-sm font-bold text-[#6B4423]"
          >
            Welcome back!
          </h2>
        </header>

        <p className="px-4 text-center text-[11px] text-[#A8794C]">
          Your cats earned while you were away
        </p>
        <p className="px-4 pb-3 text-center text-[11px] text-[#A8794C]">
          Away for {awayText}
        </p>

        <div className="mx-4 mb-3 flex items-center justify-center gap-2 border-2 border-[#D4B896] bg-[#FFF8E7] py-4">
          <img
            src="/pixel_coin.png"
            alt=""
            className="h-5 w-5"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-2xl font-bold text-[#6B4423]">{formatCompact(claimableGold)}</span>
        </div>

        <div className="px-4 pb-2">

          <button className="w-full border-2 border-[#4F7A28] bg-[#7EB84A] py-2.5 text-sm font-bold text-white disabled:opacity-50" type="button" onClick={handleClaim} disabled={pending || step !== 'idle'}>
            {pending ? '…' : 'Collect'}
          </button>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={handleClaimX2}
            type="button"
            disabled={pending || step !== 'idle'}
            className="flex w-full items-center justify-between border-2 border-[#C68B3C] bg-[#FFD54F] px-3 py-2 disabled:opacity-50 mb-2"
          >
            {pendingType === EventType.OfflineReward ? (
              <span className="flex min-h-[23px] w-full items-center justify-center">
                <LoadingDots />
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#6B4423]">
                  Collect ×2
                </span>
                <span className="border-2 border-[#4F7A28] bg-[#7EB84A] px-2.5 py-0.5 text-[10px] font-medium text-white">
                  {rewardPrice ? Number(formatUnits(rewardPrice, 18)).toFixed(2) : '…'} USDm
                </span>
              </>
            )}
          </button>
          {step !== 'idle' && (
            <p className="px-4 pb-2 text-center text-[11px] text-[#A8794C]">
              {step === 'approving' ? 'Approve in your wallet…'
                : step === 'purchasing' ? 'Confirm the purchase…'
                  : 'Activating…'}
            </p>
          )}
          {(error || claimError) && (
            <p className="px-4 pb-2 text-center text-[11px] text-[#C0392B]">{error || claimError}
            </p>
          )}
        </div>
      </section>
    </Modal >
  )
}
