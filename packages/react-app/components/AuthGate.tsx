'use client';

import { useProfileEvents } from '@/hooks/useProfileEvents'
import { useEthereumAuth } from '@/lib/auth/signMessage';
import { useGameStore } from '@/lib/store/useGameStore';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const Screen = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[url('/menu.png')] bg-cover bg-center bg-no-repeat px-4">
    {children}
  </div>
);

export function AuthGate({ children }: { children: React.ReactNode }) {
  useProfileEvents() 
  const [hasMounted, setHasMounted] = useState(false);
  const authStatus = useGameStore((s) => s.authStatus);
  const { address } = useAccount();
  const { signIn, status, errorMessage } = useEthereumAuth();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || authStatus === 'loading') {
    return (
      <Screen>
        <div className="w-[200px] overflow-hidden border-[3px] border-[#443226] bg-[#6E4E38] p-1">
          <div className="h-3 w-0 animate-[fill_1.5s_steps(8)_infinite] bg-[#8A6752]" />
        </div>
        <p className="text-xs font-medium text-[#4A3540]">Loading...</p>
      </Screen>
    );
  }

  if (authStatus === 'authenticated') {
    return <>{children}</>;
  }

  if (status === 'signing' || status === 'verifying') {
    return (
      <Screen>
        <p className="text-xs text-[#4A3540]">
          {status === 'signing'
            ? 'Sign the message in your wallet...'
            : 'Verifying...'}
        </p>
      </Screen>
    );
  }

  return (
    <Screen>
      <h1 className="text-2xl font-bold">🐱 Cozy Cats</h1>
      <p className="text-center text-sm text-gray-600">
        Merge cats, earn gold, climb the leaderboard
      </p>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      {!address && <ConnectButton />}

      {address && (
        <button
          onClick={() => signIn()}
          className="rounded-lg bg-[#7EB84A] px-8 py-3 font-bold text-white"
        >
          Play
        </button>
      )}
    </Screen>
  );
}
