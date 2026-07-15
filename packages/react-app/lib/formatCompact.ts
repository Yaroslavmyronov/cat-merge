// LIMIT: number is exact up to ~9e15 ("9aa"). Beyond that switch to BigInt/break_infinity
// and send gold as a string from the API (JSON.parse corrupts large longs). log10 breaks on BigInt.

const SUFFIXES = [
	'', 'K', 'M', 'B', 'T',
	'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'ag', 'ah', 'ai', 'aj',
	'ak', 'al', 'am', 'an', 'ao', 'ap', 'aq', 'ar', 'as', 'at',
]

export function formatCompact(n: number): string {
	if (!Number.isFinite(n)) return '0'
	if (n < 0) return `-${formatCompact(-n)}`
	if (n < 1000) return String(Math.floor(n))

	const tier = Math.min(
		Math.floor(Math.log10(n) / 3),
		SUFFIXES.length - 1,
	)
	const scaled = n / Math.pow(10, tier * 3)

	const digits = scaled >= 100 ? 0 : 1

	const factor = Math.pow(10, digits)
	const truncated = Math.floor(scaled * factor) / factor

	return `${truncated.toFixed(digits)}${SUFFIXES[tier]}`
}

const fullFormatter = new Intl.NumberFormat('en')
export const formatFull = (n: number) => fullFormatter.format(Math.floor(n))