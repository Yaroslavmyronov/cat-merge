interface FarmStatsProps {
	incomePerSecond: number
	currentGold: number
}

export const FarmStats = ({ incomePerSecond, currentGold }: FarmStatsProps) => {
	return (
		<div className="flex items-center justify-between bg-[#4A3540] px-4 py-2 mb-2 mt-2">
			<p
				className="flex items-center gap-1.5"
				role="status"
				aria-label={`Доход фермы: ${incomePerSecond} золота в секунду`}
			>
				<img></img>
				<span aria-hidden="true" className="text-sm font-medium text-white">
					+{incomePerSecond}/s
				</span>
			</p>

			<p
				className="flex items-center gap-1.5"
				role="status"
				aria-label={`Золота на балансе: ${currentGold.toLocaleString()}`}
			>
				<img></img>
				<span aria-hidden="true" className="text-sm font-medium text-white">
					{currentGold.toLocaleString()}
				</span>
			</p>
		</div >
	)
}