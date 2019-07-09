import fun, {Fun} from "./fun"
import unit, {Unit} from "./unit"
import omit, {Omit} from "../functions/omit"
import pick from "../functions/pick"
import { FilterArrayKeys } from "../functions/filterKeys"
import { students } from "../data/school"
import { a } from "../examples";

export interface Table<a, b> {
	object: Array<a>
	result: Array<b>
	select: <k extends keyof a>(...keys: Array<k>) => Table<Omit<a, k>, b & Pick<a, k>>
	includes: <k extends FilterArrayKeys<a>, Obj extends (a[k] extends Array<infer O> ? O : never), res>
	(key: k, lambda: (t: Table<Obj, Unit>) => Table<object, res>) => Table<Omit<a, k>, b & { [key in k]: res }>
}

const table = <a>(object: Array<a>): Table<a, Unit> => resultTable<a, Unit>(object, Array<Unit>(object.length).fill(unit))

const resultTable = <a, b>(object: Array<a>, result: Array<b>): Table<a, b> => ({
	object,
	result,
	select<k extends keyof a>(this: Table<a, b>, ...keys: Array<k>): Table<Omit<a, k>, b & Pick<a, k>> {
		return mapTable<a, b, Omit<a, k>, Pick<a, k>>(omit<a, k>(keys), pick<a, k>(keys)).f(this)
	}
	includes<k extends FilterArrayKeys<a>, Obj extends (a[k] extends Array<infer O> ? O : never), res>
	(key: k, lambda: (t: Table<Obj, Unit>) => Table<object, res>): Table<Omit<a, k>, b & { [key in k]: res }> {
			return mapTable<a, b, Omit<a, k>, { [key in k]: res }>(omit<a, k>([key]), 
			this.object.map(this.object => { [this.object]: lambda(table(this.object[key]).result))) }.f(this)
			/*lambda(table([key] as any))).f(this)*/
	}
})

const maptoRes = <a, k extends FilterArrayKeys<a>, { [key in k]: res }, Obj extends (a[k] extends Array<infer O> ? O : never), res>
(lambda: Fun<Table<Obj, Unit>, Table<object, res>>): Fun<a, { [key in k]: res }> =>
	fun(a =>
		a.object.map(lambda(table(this.object[key]).result)).f(this)
	)

const mapTable = <a, b, c, d>(f: Fun<a, c>, g: Fun<a, d>): Fun<Table<a, b>, Table<c, b & d>> =>
	fun(t =>
		resultTable<c, b & d>(t.object.map(f.f), t.object.map((item, index) => g.then(fun(d => ({ ...d, ...t.result[index] }))).f(item)))
	)

export default table
