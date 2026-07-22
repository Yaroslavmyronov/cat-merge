'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Address } from 'viem';

import { apiFetch } from '@/lib/api/fetchInstance';
import { useGameStore } from '@/lib/store/useGameStore';

export const SessionChecker = ({ children }: { children: ReactNode }) => {
  const fetchingStatusRef = useRef(false);
  const setAuthStatus = useGameStore((s) => s.setAuthStatus);

  useEffect(() => {
    const fetchStatus = async () => {
      if (fetchingStatusRef.current) {
        return;
      }
      fetchingStatusRef.current = true;
      try {
        const data = await apiFetch<{ currentAddress?: Address }>('/auth/me');
        console.log('SessionChecker: /auth/me response:', data.currentAddress);
        setAuthStatus(
          data.currentAddress ? 'authenticated' : 'unauthenticated',
        );
      } catch (_error) {
        console.error(_error);
        setAuthStatus('unauthenticated');
      } finally {
        fetchingStatusRef.current = false;
      }
    };
    fetchStatus();
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchStatus();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  return <>{children}</>;
};
