import { useProfile } from '@/hooks/useProfile'
import { formatCompact, formatFull } from '@/lib/formatCompact'

import { LeagueIcon } from './ui/LeagueIcon'
import { LeagueType } from '@/lib/types/player'

export const Header = () => {
  const { data: profile, loading } = useProfile()

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
              loading ? 'Loading balance' : `${formatFull(profile?.balance ?? 0)} gold coins`
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
              {loading ? '—' : formatCompact(profile?.balance ?? 0)}
            </span>
          </p>

          <p
            className="flex items-center gap-1.5"
            role="status"
            aria-label={loading ? 'Loading league' : `${profile?.league ?? 'unknown'} league`}
          >
            {!loading && profile?.league && <LeagueIcon league={profile.league.toLowerCase() as LeagueType} />}
            <span
              aria-hidden="true"
              className="text-sm font-medium uppercase text-[#8A5A45]"
            >
              {loading ? '—' : (profile?.league ?? '—')}
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}