'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { UserRejectedRequestError } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { useAccount, useChainId, useSignMessage } from 'wagmi';

import { apiFetch } from '@/lib/api/fetchInstance';
import { useGameStore } from '@/lib/store/useGameStore';

type AuthState = {
  status: 'idle' | 'signing' | 'verifying';
  errorMessage?: string;
};

export const useEthereumAuth = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const setAuthStatus = useGameStore((s) => s.setAuthStatus);
  const [{ status, ...state }, setState] = useState<AuthState>({
    status: 'idle',
  });

  const signIn = useCallback(async () => {
    if (!address) return;

    setState({ errorMessage: undefined, status: 'signing' });

    try {
      const { message: nonce } = await apiFetch<{ message: string }>(
        '/auth/nonce',
      );

      const message = createSiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to Cozy Cats.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      let signature: string;

      try {
        signature = await signMessageAsync({ message });
      } catch (error) {
        if (error instanceof UserRejectedRequestError) {
          toast.error('Signature request was rejected by user');
          setState({ status: 'idle' });
          return;
        }
        throw error;
      }
      setState({ status: 'verifying' });
      await apiFetch<{ token: string }>('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ message, signature }),
      });
      setAuthStatus('authenticated');
      setState({ status: 'idle' });
      return true;
    } catch (error) {
      console.error('Sign in failed:', error);
      toast.error('Sign in failed');
      setAuthStatus('unauthenticated');
      setState({ errorMessage: 'Sign in failed', status: 'idle' });
    }
  }, [address, chainId, signMessageAsync, setAuthStatus]);

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    setAuthStatus('unauthenticated');
  }, [setAuthStatus]);

  return {
    signIn,
    signOut,
    status,
    errorMessage: state.errorMessage,
  };
};
