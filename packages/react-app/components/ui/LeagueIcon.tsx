import { LeagueType } from '@/lib/types/player'

export const LeagueIcon = ({ league, size = 16 }: { league: LeagueType; size?: number }) => {
	return (
		<img
			src={`/league-${league}.png`}
			alt=""
			style={{ width: size, height: size, imageRendering: 'pixelated' }}
		/>
	)
}