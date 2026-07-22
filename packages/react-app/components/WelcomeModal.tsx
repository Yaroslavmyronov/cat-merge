'use client';
import { Modal } from '@/components/ui/Modal';
import { useGameStore } from '@/lib/store/useGameStore';
import { useWelcomeModalStore } from '@/lib/store/useWelcomeModalStore';
import { useState } from 'react';

export const WelcomeModal = () => {
  const { close, isOpen } = useWelcomeModalStore();
  const setBoard = useGameStore((s) => s.setBoard);
  const [pending, setPending] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={close}>
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
          Away for 13s
        </p>

        <div className="mx-4 mb-3 flex items-center justify-center gap-2 border-2 border-[#D4B896] bg-[#FFF8E7] py-4">
          <img
            src="/pixel_coin.png"
            alt=""
            className="h-5 w-5"
            style={{ imageRendering: 'pixelated' }}
          />
          <span className="text-2xl font-bold text-[#6B4423]">2344kk</span>
        </div>

        <div className="px-4 pb-2">
          <button
            type="button"
            disabled={pending}
            className="w-full border-2 border-[#4F7A28] bg-[#7EB84A] py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {pending ? '…' : 'Collect'}
          </button>
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={pending}
            className="flex w-full items-center justify-center gap-1.5 border-2 border-[#C68B3C] bg-[#FFD54F] py-2 text-xs font-bold text-[#6B4423] disabled:opacity-50"
          >
            Collect ×2 - 2288M
          </button>
        </div>
      </section>
    </Modal>
  );
};
