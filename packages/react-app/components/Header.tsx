import { LeagueIcon } from './ui/LeagueIcon'

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="relative inline-block ml-[29%]">
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
            aria-label="12345 gold coins"
          >
            <img
              src="/pixel_coin.png"
              alt=""
              className="h-4 w-4"
              style={{ imageRendering: 'pixelated' }}
            />
            <span aria-hidden="true" className="text-sm font-medium text-[#4A3540]">
              12,345
            </span>
          </p>
          <p
            className="flex items-center gap-1.5"
            role="status"
            aria-label="League: bronze"
          >
            <LeagueIcon league="bronze" />
            <span aria-hidden="true" className="text-sm font-medium uppercase text-[#8A5A45]">
              bronze
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}