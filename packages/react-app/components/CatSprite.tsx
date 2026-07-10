const CATS: Record<number, { x: number; y: number; w: number; h: number }> = {
	1: { x: 60, y: 50, w: 210, h: 230 },
	2: { x: 330, y: 50, w: 210, h: 230 },
	3: { x: 600, y: 50, w: 210, h: 230 },
	4: { x: 870, y: 50, w: 210, h: 230 },
	5: { x: 1140, y: 50, w: 210, h: 230 },
	10: { x: 60, y: 330, w: 210, h: 230 },
	15: { x: 330, y: 330, w: 210, h: 230 },
	20: { x: 600, y: 330, w: 210, h: 230 },
	25: { x: 870, y: 330, w: 210, h: 230 },
	30: { x: 1140, y: 330, w: 210, h: 230 },
	35: { x: 60, y: 610, w: 210, h: 230 },
	40: { x: 330, y: 610, w: 210, h: 230 },
	45: { x: 600, y: 610, w: 210, h: 230 },
	50: { x: 870, y: 610, w: 210, h: 230 },
	100: { x: 1140, y: 610, w: 210, h: 230 },
}

const SHEET_WIDTH = 1400
const SHEET_HEIGHT = 890

const AVAILABLE_LEVELS = Object.keys(CATS)
	.map(Number)
	.sort((a, b) => a - b)

function getSpriteLevel(level: number): number {
	let closest = AVAILABLE_LEVELS[0]
	for (const available of AVAILABLE_LEVELS) {
		if (available <= level) {
			closest = available
		} else {
			break
		}
	}
	return closest
}

interface CatSpriteProps {
	level: number
	size?: number
	className?: string
	showLevel?: boolean
}

export function CatSprite({ level, size = 60, className, }: CatSpriteProps) {
	const spriteLevel = getSpriteLevel(level)
	const cat = CATS[spriteLevel]

	const scale = size / cat.w
	const height = cat.h * scale

	return (
		<div className={className} style={{ position: 'relative', width: size, height }}>
			<div
				className="h-full w-full"
				style={{
					backgroundImage: 'url(/pixel_cats_fullbody_spritesheet.png)',
					backgroundSize: `${SHEET_WIDTH * scale}px ${SHEET_HEIGHT * scale}px`,
					backgroundPosition: `-${cat.x * scale}px -${cat.y * scale}px`,
					imageRendering: 'pixelated',
				}}
			/>
		</div>
	)
}