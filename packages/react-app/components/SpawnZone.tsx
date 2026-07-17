import { apiFetch } from '@/lib/api/fetchInstance'

export const SpawnZone = () => {

	const handleClick = async () => {
		try {
			await apiFetch('/board/buy-unit', {
				method: 'POST',
				// body: JSON.stringify({ fromIndex, toIndex }),
			})
		} catch (e) {
			return null
		}

	}
	return (
		<section className="relative flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-[#4A3540] mt-[136px]">
			<button onClick={handleClick}>buy cat</button>
		</section>)
}