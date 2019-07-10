import fun, {Fun} from "./fun"
import unit, {Unit} from "./unit"
import omit, {Omit} from "../functions/omit"
import pick from "../functions/pick"
import {FilterArrayKeys} from "../functions/filterKeys"

type ArrayType<a> = a extends Array<infer O> ? O : never

export interface Table<a, b> {
	object: Array<a>
	result: Array<b>
	select: <k extends keyof a>(...keys: Array<k>) => Table<Omit<a, k>, b & Pick<a, k>>
	includes: <k extends FilterArrayKeys<a>, Obj extends ArrayType<a[k]>, res>
	(key: k, lambda: (t: Table<Obj, Unit>) => Table<object, res>) => Table<Omit<a, k>, b & { [key in k]: Array<res> }>
}

const table = <a>(object: Array<a>): Table<a, Unit> => resultTable<a, Unit>(object, Array<Unit>(object.length).fill(unit))

const resultTable = <a, b>(object: Array<a>, result: Array<b>): Table<a, b> => ({
	object,
	result,
	select<k extends keyof a>(this: Table<a, b>, ...keys: Array<k>): Table<Omit<a, k>, b & Pick<a, k>> {
		return mapTable<a, b, Omit<a, k>, Pick<a, k>>(omit<a, k>(keys), pick<a, k>(keys)).f(this)
	},
	includes<k extends FilterArrayKeys<a>, Obj extends ArrayType<a[k]>, res> (key: k, lambda: (t: Table<Obj, Unit>) => Table<object, res>):
	Table<Omit<a, k>, b & { [key in k]: Array<res> }> {
		const res: Fun<a, { [key in k]: Array<res> }> = fun(a => {
			return ({ [key]: lambda(table((Array.isArray(a[key]) ? a[key] : []) as Array<Obj>)).result }) as { [key in k]: Array<res> }
		})
		return mapTable<a, b, Omit<a, k>, { [key in k]: Array<res> }>(omit<a, k>([key]), res).f(this)
	}
})

const mapTable = <a, b, c, d>(f: Fun<a, c>, g: Fun<a, d>): Fun<Table<a, b>, Table<c, b & d>> =>
	fun(t =>
		resultTable<c, b & d>(t.object.map(f.f), t.object.map((item, index) => g.then(fun(d => ({ ...d, ...t.result[index] }))).f(item)))
	)

export default table
