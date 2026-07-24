'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  RainbowKitProvider,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { celo } from 'wagmi/chains'

import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import { Toaster } from 'react-hot-toast'
import Layout from '../components/Layout'
import { SessionChecker } from './ SessionChecker'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet],
    },
  ],
  {
    appName: 'Cozy Cats',
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '044601f65212332475a09bc14ceb3c34',
  },
)

export const config = createConfig({
  connectors,
  chains: [celo],
  transports: {
    [celo.id]: http(),
  },
})

const queryClient = new QueryClient()

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Toaster position="bottom-right" />
          <SessionChecker>
            <Layout>{children}</Layout>
          </SessionChecker>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
