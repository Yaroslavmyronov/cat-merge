import { useBoostModalStore } from '@/lib/store/useBoostModalStore'
import { useGameStore } from '@/lib/store/useGameStore'
import { useShopModalStore } from '@/lib/store/useShopModalStore'
import { useTopModalStore } from '@/lib/store/useTopModalStore'
import { useWelcomeModalStore } from '@/lib/store/useWelcomeModalStore'
import { CupIcon } from './ui/CupIcon'
import { MeowpediaIcon } from './ui/MeowpediaIcon'
import { NavItem } from './ui/NavItem'
import { ShopIcon } from './ui/ShopIcon'
import { UpgradeIcon } from './ui/UpgradeIcon'

export const BottomNav = () => {
  const openShop = useShopModalStore((s) => s.open)
  const openBoost = useBoostModalStore((s) => s.open)
  const openTop = useTopModalStore((s) => s.open)
  const bonusClaimAvailable = useGameStore((s) => s.profile?.bonusClaimAvailable)
  const openWelcome = useWelcomeModalStore((s) => s.open)
  const handleShop = () => {
    if (bonusClaimAvailable) {
      openWelcome()
      return
    }
    openShop()
  }
  return (
    <nav
      aria-label="bottom navigation"
      className="shrink-0 bg-[#A87E54] px-2 py-3 border-t-2 border-[#8B5E3C]"
    >
      <ul className="flex items-center justify-center gap-2">
        <NavItem item={{ label: 'Shop' }} onClick={handleShop}>
          <ShopIcon className="h-[25px] w-[25px]" />
        </NavItem>
        <NavItem item={{ label: 'Boost' }} onClick={openBoost}>
          <UpgradeIcon className="h-[25px] w-[25px]" />
        </NavItem>
        <NavItem item={{ label: 'Top' }} onClick={openTop}>
          <CupIcon className="h-[25px] w-[25px]" />
        </NavItem>
        <NavItem item={{ label: 'Cats' }}>
          <MeowpediaIcon className="h-[25px] w-[25px]" />
        </NavItem>
      </ul>
    </nav>
  )
}
