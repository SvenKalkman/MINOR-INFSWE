import fun, {Fun} from "../functors/fun"

export default <T, k extends keyof T>(keys: Array<k>): Fun<T, Pick<T, k>> =>
	fun(object =>
		keys.map(k => k in object ? { [k]: object[k] } : {})
		.reduce((res, o) => ({ ...res, ...o }), {}) as Pick<T, k>
	)
