interface CloseButtonProps {
	onClose: () => void
	label: string
}

export const CloseButton = ({ onClose, label }: CloseButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClose}
			aria-label={label}
			className="absolute -right-[18px] -top-[18px] z-10 flex h-11 w-11 items-center justify-center"
		>
			<span className="flex h-8 w-8 items-center justify-center border-2 border-[#8B2E2E] bg-[#D94545] text-xs font-bold text-white">
				✕
			</span>
		</button>
	)
}