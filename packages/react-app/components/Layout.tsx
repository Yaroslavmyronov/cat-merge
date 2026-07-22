import { FC, ReactNode } from 'react';
import { AuthGate } from './AuthGate';
import { Header } from './Header';
import { ShopModal } from './ShopModal';
import { WelcomeModal } from './WelcomeModal';
import { BoostModal } from './BoostModal';

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="bg-gypsum flex min-h-screen justify-center">
      <div
        id="app-root"
        style={{ imageRendering: 'pixelated' }}
        className="relative flex min-h-screen w-full max-w-[420px] flex-col bg-[url('/pixel_room_background.png')] bg-cover bg-center bg-no-repeat"
      >
        <AuthGate>
          <Header />
          {children}
          <WelcomeModal />
          <ShopModal />
          <BoostModal />
        </AuthGate>
      </div>
    </div>
  );
};

export default Layout;
