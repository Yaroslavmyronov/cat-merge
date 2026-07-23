import { useLiveValue } from '@/hooks/useLiveValue';
import { formatCompact, formatFull } from '@/lib/formatCompact';
import { useGameStore } from '@/lib/store/useGameStore';

export const FarmStats = () => {
  const state = useGameStore((s) => s.board);

  const liveBalance = useLiveValue(
    state?.balance ?? 0,
    state?.incomeRate ?? 0,
    state?.serverTime ?? '',
  );
  const incomeRate = state?.incomeRate ?? 0;
  return (
    <div className="w-full">
      <div className="mx-auto mt-2 flex w-[250px] items-center border-[3px] border-[#443226] bg-[#6E4E38] px-1 py-1">
        <p
          className="flex flex-1 items-center justify-start gap-1.5"
          role="status"
          aria-label={`Balance: ${formatFull(liveBalance)} gold`}
        >
          <img
            src="/pixel_coin.png"
            alt=""
            className="inset-0 h-[14px] w-[14px]"
            style={{ imageRendering: 'pixelated' }}
          />
          <span
            aria-hidden="true"
            className="text-xs font-medium tabular-nums text-white"
          >
            {formatCompact(liveBalance)}
          </span>
        </p>
        <div className="mx-2 h-[22px] w-[3px] shrink-0 bg-[#8A6752]"></div>
        <p
          className="flex flex-1 items-center justify-end gap-1.5"
          role="status"
          aria-label={`Farm income: ${formatFull(incomeRate)} gold per second`}
        >
          <img
            src="/lightning.png"
            alt=""
            className="inset-0 h-[14px] w-[14px]"
            style={{ imageRendering: 'pixelated' }}
          />
          <span
            aria-hidden="true"
            className="text-xs font-medium tabular-nums text-white"
          >
            {formatCompact(incomeRate)}/s
          </span>
        </p>
      </div>
      <div className="mx-auto flex h-2 w-[250px] justify-center gap-32">
        <div className="h-full w-[9px] border-x-[3px] border-[#443226] bg-[#6E4E38]"></div>
        <div className="h-full w-[9px] border-x-[3px] border-[#443226] bg-[#6E4E38]"></div>
      </div>
    </div>
  );
};
