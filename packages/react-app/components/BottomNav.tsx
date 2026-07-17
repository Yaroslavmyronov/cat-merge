import { useShopModalStore } from '@/lib/store/useShopModalStore'
import { CupIcon } from './ui/CupIcon'
import { MeowpediaIcon } from './ui/MeowpediaIcon'
import { NavItem } from './ui/NavItem'
import { ShopIcon } from './ui/ShopIcon'
import { UpgradeIcon } from './ui/UpgradeIcon'

export const BottomNav = () => {
	const { open } = useShopModalStore()
	return (
		<nav aria-label="bottom navigation" className="shrink-0 px-2 py-3 bg-[#A87E54]">
			<ul className="flex items-center justify-center gap-2">
				<NavItem item={{ label: "Shop" }} onClick={open}>
					<ShopIcon className='w-[25px] h-[25px]' />
				</NavItem>
				<NavItem item={{ label: "Upgrade" }} >
					<UpgradeIcon className='w-[25px] h-[25px]' />
				</NavItem>
				<NavItem item={{ label: "Top" }} >
					<CupIcon className='w-[25px] h-[25px]' />
				</NavItem>
				<NavItem item={{ label: "Cats" }} >
					<MeowpediaIcon className='w-[25px] h-[25px]' />
				</NavItem>
			</ul>
		</nav>
	)
}
