
interface UpgradeIconProps {
	className?: string
}

export function UpgradeIcon({ className }: UpgradeIconProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 54 54"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<rect x="24" width="6" height="42" fill="#8FC47E" />
			<rect x="30" y="6" width="6" height="36" fill="#8FC47E" />
			<rect x="36" y="12" width="6" height="18" fill="#8FC47E" />
			<rect x="42" y="18" width="6" height="12" fill="#8FC47E" />
			<rect x="48" y="24" width="6" height="6" fill="#8FC47E" />
			<rect x="18" y="6" width="6" height="36" fill="#8FC47E" />
			<rect x="12" y="12" width="6" height="18" fill="#8FC47E" />
			<rect x="6" y="18" width="6" height="12" fill="#8FC47E" />
			<rect y="24" width="6" height="6" fill="#8FC47E" />
			<rect x="18" y="42" width="18" height="12" fill="#6FA55E" />
		</svg>
	)
}