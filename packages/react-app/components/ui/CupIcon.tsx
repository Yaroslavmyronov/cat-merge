interface CupIconProps {
	className?: string
}

export function CupIcon({ className }: CupIconProps) {
	return (
		<svg
			className={className}
			viewBox="0 0 54 54"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<rect width="54" height="18" fill="#7A5A66" />
			<rect x="6" y="6" width="42" height="12" fill="#F7C446" />
			<rect x="42" y="18" width="6" height="6" fill="#7A5A66" />
			<rect x="6" y="18" width="6" height="6" fill="#7A5A66" />
			<rect x="12" y="18" width="30" height="6" fill="#F7C446" />
			<rect x="12" y="24" width="30" height="6" fill="#7A5A66" />
			<rect x="12" y="36" width="30" height="6" fill="#7A5A66" />
			<rect x="18" y="30" width="18" height="6" fill="#7A5A66" />
			<rect x="24" y="30" width="6" height="6" fill="#F7C446" />
			<rect x="6" y="42" width="42" height="6" fill="#7A5A66" />
			<rect x="6" y="48" width="42" height="6" fill="#7A5A66" />
			<rect x="12" y="42" width="30" height="6" fill="#F7C446" />
		</svg>

	)
}