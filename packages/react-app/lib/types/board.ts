export interface BoardCell {
	id: string
	playerId: string
	index: number
	unitLevel: number
}

export interface BoardResponse {
	cells: BoardCell[]
	balance: number
	incomeRate: number
	lastCollectedAt: string
	serverTime: string
}