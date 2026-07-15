import { LeagueType } from './player'

export interface BoardCell {
	id: string
	playerId: string
	index: number
	unitLevel: number
}

export interface BoardResponse {
	cells: BoardCell[]
	balance: number
	totalEarned: number
	league: LeagueType
	incomeRate: number
	lastCollectedAt: string
	serverTime: string
}