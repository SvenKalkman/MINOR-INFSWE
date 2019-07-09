export type FilterKeys<T, Conditions> = {
	[K in keyof T]: T[K] extends Conditions ? K : never
}[keyof T]

export type FilterArrayKeys<T> = FilterKeys<T, Array<object>>
