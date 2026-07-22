import { formatCompact, formatFull } from '@/lib/formatCompact'

import { useLiveValue } from '@/hooks/useLiveValue'
import { useGameStore } from '@/lib/store/useGameStore'
import { LeagueType } from '@/lib/types/player'
import { LeagueIcon } from './ui/LeagueIcon'

export const Header = () => {
  const board = useGameStore((s) => s.board)
  const profile = useGameStore((s) => s.profile)
  const profileStatus = useGameStore((s) => s.profileStatus)

  const liveTotalEarned = useLiveValue(
    board?.totalEarned ?? 0,
    board?.incomeRate ?? 0,
    board?.serverTime ?? '',
  )

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="relative ml-[29%] inline-block">
        <img
          src="/desk.png"
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ imageRendering: 'pixelated' }}
        />

        <div className="relative flex flex-col gap-1 px-6 py-4">
          <p
            className="flex items-center gap-1.5"
            role="status"
            aria-label={
              profileStatus === 'loading'
                ? 'Loading balance'
                : `${formatFull(liveTotalEarned)} gold coins`
            }
          >
            <img
              src="/pixel_coin.png"
              alt=""
              className="h-4 w-4"
              style={{ imageRendering: 'pixelated' }}
            />
            <span
              aria-hidden="true"
              className="text-sm font-medium tabular-nums text-[#4A3540]"
            >
              {profileStatus === 'loading' ? '—' : formatCompact(liveTotalEarned)}
            </span>
          </p>

          <p
            className="flex items-center gap-1.5"
            role="status"
            aria-label={
              profileStatus === 'loading'
                ? 'Loading league'
                : `${profile?.league ?? 'bronze'} league`
            }
          >
            {profileStatus !== 'loading' && profile?.league && (
              <LeagueIcon league={profile.league.toLowerCase() as LeagueType} />
            )}
            <span
              aria-hidden="true"
              className="text-sm font-medium uppercase text-[#8A5A45]"
            >
              {profileStatus === 'loading' ? '—' : (profile?.league ?? '—')}
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}
