import { useBoostModalStore } from '@/lib/store/useBoostModalStore';
import { useShopModalStore } from '@/lib/store/useShopModalStore';
import { CupIcon } from './ui/CupIcon';
import { MeowpediaIcon } from './ui/MeowpediaIcon';
import { NavItem } from './ui/NavItem';
import { ShopIcon } from './ui/ShopIcon';
import { UpgradeIcon } from './ui/UpgradeIcon';

export const BottomNav = () => {
  const { open: openShop } = useShopModalStore();
  const { open: openBoost } = useBoostModalStore();
  return (
    <nav
      aria-label="bottom navigation"
      className="shrink-0 bg-[#A87E54] px-2 py-3"
    >
      <ul className="flex items-center justify-center gap-2">
        <NavItem item={{ label: 'Shop' }} onClick={openShop}>
          <ShopIcon className="h-[25px] w-[25px]" />
        </NavItem>
        <NavItem item={{ label: 'Upgrade' }} onClick={openBoost}>
          <UpgradeIcon className="h-[25px] w-[25px]" />
        </NavItem>
        <NavItem item={{ label: 'Top' }}>
          <CupIcon className="h-[25px] w-[25px]" />
        </NavItem>
        <NavItem item={{ label: 'Cats' }}>
          <MeowpediaIcon className="h-[25px] w-[25px]" />
        </NavItem>
      </ul>
    </nav>
  );
};
