export type LeagueType = 'bronze' | 'silver' | 'gold' | 'emerald' | 'sapphire' | 'amethyst'

export interface Player {
	balance: number
	incomeRate: number
	totalEarned: number
	lastCollectedAt: string
	league: LeagueType
}