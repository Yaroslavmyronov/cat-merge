'use client'

import { useProfileEvents } from '@/hooks/useProfileEvents'
import { useEthereumAuth } from '@/lib/auth/signMessage'
import { useGameStore } from '@/lib/store/useGameStore'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { MyConnectButton } from './ui/MyConnectButton'

const Screen = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[url('/menu.png')] bg-cover bg-center bg-no-repeat px-4">
    {children}
  </div>
)

export function AuthGate({ children }: { children: React.ReactNode }) {
  useProfileEvents()
  const [hasMounted, setHasMounted] = useState(false)
  const authStatus = useGameStore((s) => s.authStatus)
  const { address } = useAccount()
  const { signIn, status, errorMessage } = useEthereumAuth()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted || authStatus === 'loading') {
    return (
      <Screen>
        <div className="w-[200px] overflow-hidden border-[3px] border-[#443226] bg-[#6E4E38] p-1">
          <div className="h-3 w-0 animate-[fill_1.5s_steps(8)_infinite] bg-[#8A6752]" />
        </div>
        <p className="text-xs font-medium text-[#4A3540]">Loading...</p>
      </Screen>
    )
  }

  if (authStatus === 'authenticated') {
    return <>{children}</>
  }

  if (status === 'signing' || status === 'verifying') {
    return (
      <Screen>
        <p className="text-xs text-[#4A3540] text-center">
          {status === 'signing'
            ? 'Sign the message in your wallet...'
            : 'Verifying...'}
        </p>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="flex flex-col items-center justify-center p-4">
        <h1
          className="text-4xl text-yellow-400 mb-2"
          style={{
            textShadow: `
            -3px -3px 0 #000,  
             3px -3px 0 #000,
            -3px  3px 0 #000,
             3px  3px 0 #000,
             0px  6px 0 #000
          `
          }}
        >
          Cozy Cats
        </h1>

        <p
          className="text-gray-600 text-center leading-relaxed mb-6"
          style={{
            fontSize: '12px',
          }}
        >
          Merge cats, earn gold,<br />climb the leaderboard
        </p>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        {!address && <MyConnectButton />}

        {address && (
          <button
            type="button"
            onClick={() => signIn()}
            className="play-btn cursor-pointer bg-[#63c74d] text-white px-8 py-3 active:translate-x-[4px] active:translate-y-[4px]transition-transform duration-75"
            style={{
              fontSize: '20px',
              border: '4px solid #181425',
              boxShadow: `inset 4px 4px 0px rgba(255, 255, 255, 0.4),inset -4px -4px 0px rgba(0, 0, 0, 0.2),4px 4px 0px #181425`,
              textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
            }}
          >
            PLAY
          </button>
        )}
      </div>
    </Screen>
  )
}
