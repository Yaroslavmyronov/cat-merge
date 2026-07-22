export const LoadingDots = () => (
	<span className="inline-flex gap-[3px]">
		<span className="h-1 w-1 animate-[dot-bounce_1.2s_infinite] bg-current" />
		<span className="h-1 w-1 animate-[dot-bounce_1.2s_infinite] bg-current [animation-delay:0.15s]" />
		<span className="h-1 w-1 animate-[dot-bounce_1.2s_infinite] bg-current [animation-delay:0.3s]" />
	</span>
)