import { BaseError, UserRejectedRequestError } from 'viem'

export const isUserRejection = (e: unknown): boolean =>
	e instanceof BaseError &&
	e.walk((err) => err instanceof UserRejectedRequestError) !== null