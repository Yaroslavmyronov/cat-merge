export type LeagueType =
  'bronze' | 'silver' | 'gold' | 'emerald' | 'sapphire' | 'amethyst'

export interface Player {
  balance: number
  incomeRate: number
  totalEarned: number
  lastCollectedAt: string
  league: LeagueType
  boostActivatedAt: string | null
  boostExpiresAt: string | null
  claimableGold: number
  bonusGold: number
  bonusClaimAvailable: boolean
}