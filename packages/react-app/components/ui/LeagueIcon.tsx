type LeagueType = 'bronze' | 'silver' | 'gold' | 'emerald' | 'sapphire' | 'amethyst'

export const LeagueIcon = ({ league, size = 16 }: { league: LeagueType; size?: number }) => {
	return (
		<img
			src={`/league-${league}.png`}
			alt=""
			style={{ width: size, height: size, imageRendering: 'pixelated' }}
		/>
	)
}