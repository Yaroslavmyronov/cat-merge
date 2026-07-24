import { useGameStore } from '@/lib/store/useGameStore'
import { useTopModalStore } from '@/lib/store/useTopModalStore'
import { TopModalContent } from './TopModalContent'
import { Modal } from './ui/Modal'

export const TopModal = () => {
	const { close, isOpen } = useTopModalStore()
	const league = useGameStore((s) => s.profile?.league)

	if (!league) return null
	return (
		<Modal isOpen={isOpen} >
			{isOpen && <TopModalContent myLeague={league} onClose={close} />}
		</Modal>
	)
}