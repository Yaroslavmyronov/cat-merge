import { ReactNode } from 'react'

interface NavItemProps {
	item: { label: string }
	children: ReactNode
	onClick?: () => void
}

export const NavItem = ({ item, children, onClick }: NavItemProps) => {
	return (
		<li className="flex-1">
			<button
				onClick={onClick}
				className="relative flex w-full flex-col items-center justify-center"
				aria-label={item.label}
				type="button">
				<img className="absolute inset-0 h-full w-full" src="/frame-shop.png" alt="" />
				<div className="relative flex overflow-hidden flex-col items-center justify-center gap-1 px-2 py-3 ">
					{children}
					<p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[10px] font-medium text-[#4F3A44]">
						{item.label}
					</p>
				</div>
			</button>
		</li>
	)
}