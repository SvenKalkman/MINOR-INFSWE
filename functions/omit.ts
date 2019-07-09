import fun, {Fun} from "../functors/fun"
import {getKeys} from "./getKeys"

export type Omit<T, Conditions extends keyof T> = Pick<T, {
	[K in keyof T]: K extends Conditions ? never : K
}[keyof T]>

export default <T, k extends keyof T>(keys: Array<k>): Fun<T, Omit<T, k>> =>
		fun(object =>
				getKeys(object).map(k => (keys as Array<keyof T>).includes(k) ? {} : { [k]: object[k] })
				.reduce((res, o) => ({ ...res, ...o }), {}) as Omit<T, k>
		)
