import { BoardState } from '@/app/page'
import { apiFetch } from '@/lib/api/fetchInstance'
import { normalize } from '@/lib/normalizeBoard'
import { useGameStore } from '@/lib/store/useGameStore'
import { BoardResponse } from '@/lib/types/board'
import { useRef, useState } from 'react'

interface MergeAnimation {
	fromIndex: number
	toIndex: number
	level: number
}

export function useBoardActions() {
	const board = useGameStore((s) => s.board)
	const setBoard = useGameStore((s) => s.setBoard)

	const [isMerging, setIsMerging] = useState(false)
	const [mergeAnimation, setMergeAnimation] = useState<MergeAnimation | null>(null)
	const [pendingDelete, setPendingDelete] = useState<number | null>(null)
	const snapshotRef = useRef<BoardState | null>(null)

	async function merge(fromIndex: number, toIndex: number) {
		if (!board || isMerging) return

		const fromCat = board.cells[fromIndex]
		const toCat = board.cells[toIndex]
		if (!fromCat || !toCat || fromCat.unitLevel !== toCat.unitLevel) return

		setIsMerging(true)
		setMergeAnimation({ fromIndex, toIndex, level: toCat.unitLevel })

		try {
			const response = await apiFetch<BoardResponse>('/board/merge', {
				method: 'POST',
				body: JSON.stringify({ fromIndex, toIndex }),
			})
			setTimeout(() => {
				setBoard(normalize(response))
				setMergeAnimation(null)
				setIsMerging(false)
			}, 500)
		} catch (error) {
			setMergeAnimation(null)
			setIsMerging(false)
			const fresh = await apiFetch<BoardResponse>('/board/get-board').catch(() => null)
			if (fresh) setBoard(normalize(fresh))
		}
	}

	async function move(fromIndex: number, toIndex: number) {
		if (!board || isMerging) return

		const snapshot = board
		const optimistic = [...board.cells]
		optimistic[toIndex] = optimistic[fromIndex]
		optimistic[fromIndex] = null
		setBoard({ ...board, cells: optimistic })

		try {
			const response = await apiFetch<BoardResponse>('/board/move', {
				method: 'POST',
				body: JSON.stringify({ fromIndex, toIndex }),
			})
			setBoard(normalize(response))
		} catch (error) {
			setBoard(snapshot)
			console.error('Failed to move cat:', error)
		}
	}

	function requestDelete(index: number) {
		if (!board) return

		snapshotRef.current = board
		setPendingDelete(index)

		const optimistic = [...board.cells]
		optimistic[index] = null
		setBoard({ ...board, cells: optimistic })
	}

	function cancelDelete() {
		if (snapshotRef.current) {
			setBoard(snapshotRef.current)
			snapshotRef.current = null
		}
		setPendingDelete(null)
	}

	async function confirmDelete() {
		if (pendingDelete === null) return

		const index = pendingDelete
		const snapshot = snapshotRef.current
		setPendingDelete(null)
		snapshotRef.current = null

		try {
			const response = await apiFetch<BoardResponse>('/board/remove-unit', {
				method: 'POST',
				body: JSON.stringify(index),
			})
			setBoard(normalize(response))
		} catch (error) {
			if (snapshot) setBoard(snapshot)
			console.error('Failed to delete cat:', error)
		}
	}

	const catToDelete =
		pendingDelete !== null ? (snapshotRef.current?.cells[pendingDelete] ?? null) : null

	return {
		merge,
		move,
		requestDelete,
		cancelDelete,
		confirmDelete,
		mergeAnimation,
		pendingDelete,
		catToDelete,
	}
}