'use client'
import { Modal } from '@/components/ui/Modal'
import { usePurchase } from '@/hooks/usePurchase'
import { CUSD_MAINNET, EventType, MERGE_CAT_ADDRESS } from '@/lib/contracts/mergeCat'
import { formatCompact } from '@/lib/formatCompact'
import { formatTimer } from '@/lib/formatTimer'
import { useBoostModalStore } from '@/lib/store/useBoostModalStore'
import { useGameStore } from '@/lib/store/useGameStore'
import { MergeCatABI } from '@/MergeCat'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { LoadingDots } from './ui/LoadingDots'


export const BoostModal = () => {
  const { close, isOpen } = useBoostModalStore()
  const setAwaitingPurchase = useGameStore((s) => s.setAwaitingPurchase)
  const boostExpiresAt = useGameStore((s) => s.profile?.boostExpiresAt)
  const boostActivatedAt = useGameStore((s) => s.profile?.boostActivatedAt)
  const awaitingPurchase = useGameStore((s) => s.awaitingPurchase)
  const incomeRate = useGameStore((s) => s.board?.incomeRate ?? 0)
  const SEGMENTS = 16

  const { buy, step, error, pendingType } = usePurchase()

  const isBoostActive = boostExpiresAt != null &&
    new Date(boostExpiresAt).getTime() > Date.now()

  const { data: prices } = useReadContracts({
    contracts: [
      { address: MERGE_CAT_ADDRESS, abi: MergeCatABI, functionName: 'priceOf', args: [CUSD_MAINNET, EventType.BoostSpeed75m] },
      { address: MERGE_CAT_ADDRESS, abi: MergeCatABI, functionName: 'priceOf', args: [CUSD_MAINNET, EventType.BoostSpeed4h] },
      { address: MERGE_CAT_ADDRESS, abi: MergeCatABI, functionName: 'priceOf', args: [CUSD_MAINNET, EventType.BoostSpeed24h] },
    ],
    query: { enabled: isOpen }
  })

  const price75m = prices?.[0]?.result
  const price4h = prices?.[1]?.result
  const price24h = prices?.[2]?.result

  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  const handleBuy = async (eventType: EventType) => {
    const ok = await buy(eventType)
    if (!ok) return
    setAwaitingPurchase(true)
  }

  useEffect(() => {
    if (!isOpen || !boostExpiresAt || !boostActivatedAt) return

    const start = new Date(boostActivatedAt).getTime()
    const end = new Date(boostExpiresAt).getTime()
    const total = end - start

    const tick = () => {
      const now = Date.now()
      const remaining = Math.max(0, end - now)
      setTimeLeft(remaining)
      setProgress(total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0)
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isOpen, boostExpiresAt, boostActivatedAt])

  const barColor = (progress: number) => {
    if (progress > 0.5) return 'bg-[#7EB84A]'
    if (progress > 0.2) return 'bg-[#F0B429]'
    return 'bg-[#D94545]'
  }

  const timerColor = progress > 0.5 ? 'text-[#2E7D32]' : progress > 0.2 ? 'text-[#B5851A]' : 'text-[#C0392B]'

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <section
        aria-labelledby="boost"
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
            Speed ×2
          </h2>
        </header>
        <div className="mx-auto h-[100px] w-[100px] overflow-hidden">
          <img
            className="h-full w-full object-cover object-center"
            src="/cat_with_clock.png"
            alt=""
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="flex flex-col items-center gap-2 pb-2 pt-1.5">
          <div className="relative inline-flex items-center gap-2">
            <span className="border-2 border-[#4F7A28] bg-[#7EB84A] px-2.5 py-0.5 text-xs font-medium text-white">
              {formatCompact(incomeRate)}/s
            </span>
            <span className="absolute -right-[14px] -top-2 rotate-[32deg] border-2 border-[#B5851A] bg-[#FFD54F] px-1.5 text-[8px] font-bold text-[#6B4423]">
              ×2
            </span>
          </div>
        </div>
        {isBoostActive && (
          <>
            <div className={`mx-4 mb-1.5 mt-1 text-center text-[15px] font-medium tracking-[1px] ${timerColor}`}>
              {formatTimer(timeLeft)}
            </div>
            <div className="mx-4 mb-1 text-center text-[10px] text-[#A8794C]">
              {awaitingPurchase ? (
                <span className="inline-flex items-center gap-1">
                  <LoadingDots /> Adding time…
                </span>
              ) : (
                'Boost active — buy more to add time'
              )}
            </div>
            <div className="mx-4 mb-4 mt-1.5 flex h-[14px] items-center gap-[2px] border-2 border-[#D4B896] bg-[#FFF8E7] px-[3px]">
              {Array.from({ length: SEGMENTS }).map((_, i) => {
                const filled = i < Math.round(progress * SEGMENTS)
                return (
                  <span
                    key={i}
                    className={`h-2 flex-1 transition-colors duration-300 ${filled ? barColor(progress) : 'bg-[#E5D5B8]'
                      }`}
                  />
                )
              })}
            </div>
          </>
        )}
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={() => handleBuy(EventType.BoostSpeed75m)} disabled={step !== 'idle'} className="flex flex-1 cursor-pointer flex-col items-center gap-1.5 border-2 border-[#C68B3C] bg-[#FFF8E7] pb-2 pt-2.5 hover:bg-[#f5ebd6]">
            <span className="text-[13px] font-medium text-[#6B4423]">
              75 min
            </span>
            <span className="box-border w-full px-1">
              <span className="block border-2 border-[#4F7A28] bg-[#7EB84A] py-1 text-center text-[11px] font-medium text-white">
                {pendingType === EventType.BoostSpeed75m
                  ? <LoadingDots />
                  : price75m ? Number(formatUnits(price75m, 18)).toFixed(2) : '…'}
              </span>
            </span>
          </button>
          <button onClick={() => handleBuy(EventType.BoostSpeed4h)} disabled={step !== 'idle'} className="relative flex flex-1 cursor-pointer flex-col items-center gap-1.5 border-2 border-[#C68B3C] bg-[#FFF8E7] pb-2 pt-2.5 hover:bg-[#f5ebd6]">
            <span className="text-[13px] font-medium text-[#6B4423]">
              4 hours
            </span>
            <span className="box-border w-full px-1">
              <span className="block border-2 border-[#4F7A28] bg-[#7EB84A] py-1 text-center text-[11px] font-medium text-white">
                {pendingType === EventType.BoostSpeed4h
                  ? <LoadingDots />
                  : price4h ? Number(formatUnits(price4h, 18)).toFixed(2) : '…'}
              </span>
            </span>
          </button>
          <button onClick={() => handleBuy(EventType.BoostSpeed24h)} disabled={step !== 'idle'} className="flex flex-1 cursor-pointer flex-col items-center gap-1.5 border-2 border-[#C68B3C] bg-[#FFF8E7] pb-2 pt-2.5 hover:bg-[#f5ebd6]">
            <span className="text-[13px] font-medium text-[#6B4423]">24 hours</span>
            <span className="box-border w-full px-1">
              <span className="block border-2 border-[#4F7A28] bg-[#7EB84A] py-1 text-center text-[11px] font-medium text-white">
                {pendingType === EventType.BoostSpeed24h
                  ? <LoadingDots />
                  : price24h ? Number(formatUnits(price24h, 18)).toFixed(2) : '…'}
              </span>
            </span>
          </button>
        </div>
        {step !== 'idle' && (
          <p className="mb-2 text-center text-[11px] text-[#A8794C]">
            {step === 'approving' ? 'Approve in your wallet…'
              : step === 'purchasing' ? 'Confirm the purchase…'
                : 'Activating…'}
          </p>
        )}
        {error && <p className="mb-2 text-center text-[11px] text-[#C0392B]">{error}</p>}
        <div className="px-4 pb-3.5 text-center text-[10px] text-[#A8794C]">
          Paid in USDm with your MiniPay wallet
        </div>
      </section>
    </Modal>
  )
}
