'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	const [container, setContainer] = useState<HTMLElement | null>(null)
	const backdropRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setContainer(document.getElementById('app-root'))
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!container) return null

	return ReactDOM.createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					ref={backdropRef}
					onClick={(e) => {
						if (e.target === backdropRef.current) onClose()
					}}
					role="dialog"
					aria-modal="true"
					className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className="flex w-full items-center justify-center"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		container,
	)
}