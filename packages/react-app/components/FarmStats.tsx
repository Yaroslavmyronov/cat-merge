import { useLiveValue } from '@/hooks/useLiveValue'
import { formatCompact, formatFull } from '@/lib/formatCompact'
import { useGameStore } from '@/lib/store/useGameStore'

export const FarmStats = () => {
	const state = useGameStore((s) => s.board)

	const liveBalance = useLiveValue(state?.balance ?? 0, state?.incomeRate ?? 0, state?.serverTime ?? '')
	const incomeRate = state?.incomeRate ?? 0
	return (
		<div className="w-full">
			<div className="flex items-center bg-[#6E4E38] px-1 py-1 mt-2 border-[#443226] border-[3px] w-[250px] mx-auto">
				<p
					className="flex flex-1 items-center gap-1.5 justify-start"
					role="status"
					aria-label={`Balance: ${formatFull(liveBalance)} gold`}
				>
					<img
						src="/pixel_coin.png"
						alt=""
						className="inset-0 h-[14px] w-[14px]"
						style={{ imageRendering: 'pixelated' }}
					/>
					<span aria-hidden="true" className="text-xs font-medium text-white tabular-nums">
						{formatCompact(liveBalance)}
					</span>
				</p>
				<div className="h-[22px] w-[3px] bg-[#8A6752] shrink-0 mx-2"></div>
				<p
					className="flex flex-1 items-center gap-1.5 justify-end"
					role="status"
					aria-label={`Farm income: ${formatFull(incomeRate)} gold per second`}
				>
					<img
						src="/lightning.png"
						alt=""
						className="inset-0 h-[14px] w-[14px]"
						style={{ imageRendering: 'pixelated' }}
					/>
					<span aria-hidden="true" className="text-xs font-medium text-white tabular-nums">
						{formatCompact(incomeRate)}/s
					</span>
				</p>
			</div >
			<div className="w-[250px] h-2 flex mx-auto justify-center gap-32">
				<div className="w-[9px] h-full bg-[#6E4E38] border-[#443226] border-x-[3px]"></div>
				<div className="w-[9px] h-full bg-[#6E4E38] border-[#443226] border-x-[3px]"></div>
			</div>
		</div>
	)
}