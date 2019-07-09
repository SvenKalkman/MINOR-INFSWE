export const a = 1

// object: contains the data
// result: contains the result object (SHOULD BE LAZY)
// select: extracts chosen properties from object and puts them in result
// inculdes: takes property K of type Array and a function for a SelectableTable<K>, and returns the result of that SelectableTable
// call: returns the result

import fun, {Fun} from "./functors/fun"
//import id, {Id} from "./identity"

export const id = <a>(): Fun<a,a> => fun(x => x)

export type Pair<a, b> = {
	left: a
	right: b
	map: <c, d>() => Fun<Fun<a, c>, Fun<Fun<b, d>, Pair<c, d>>>
	mapLeft: <c>() => Fun<Fun<a, c>, Pair<c, b>>
	mapRight: <c>() => Fun<Fun<b, c>, Pair<a, c>>
	swap: () => Pair<b, a>
}

const functionsPair = <a, b>() => ({
	map<c, d>(this: Pair<a, b>): Fun<Fun<a, c>, Fun<Fun<b, d>, Pair<c, d>>> { return mapPair<a, b, c, d>().f(this) },
	mapLeft<c>(this: Pair<a, b>): Fun<Fun<a, c>, Pair<c, b>> { return mapPairLeft<a, b, c>().f(this) },
	mapRight<c>(this: Pair<a, b>): Fun<Fun<b, c>, Pair<a, c>> { return mapPairRight<a, b, c>().f(this) },
	swap(this: Pair<a, b>): Pair<b, a> { return swapPair<a, b>().f(this) }
})

const pair = <a, b>(): Fun<a, Fun<b, Pair<a, b>>> =>
	fun(left =>
	fun(right =>
		({ left, right, ...functionsPair<a, b>() })
	))

const mapPair = <a, b, c, d>(): Fun<Pair<a, b>, Fun<Fun<a, c>, Fun<Fun<b, d>, Pair<c, d>>>> =>
	fun(p =>
	fun(f =>
	fun(g =>
		pair<c, d>().f(f.f(p.left)).f(g.f(p.right))
	)))

const mapPairLeft = <a, b, c>(): Fun<Pair<a, b>, Fun<Fun<a, c>, Pair<c, b>>> =>
	fun(p =>
	fun(f =>
		mapPair<a, b, c, b>().f(p).f(f).f(id<b>())
	))

const mapPairRight = <a, b, c>(): Fun<Pair<a, b>, Fun<Fun<b, c>, Pair<a, c>>> =>
	fun(p =>
	fun(f =>
		mapPair<a, b, a, c>().f(p).f(id<a>()).f(f)
	))

const swapPair = <a, b>(): Fun<Pair<a, b>, Pair<b, a>> =>
	fun(p =>
		pair<b, a>().f(p.right).f(p.left)
	)

export default pair

/*export interface Fun<a, b> {
	f: (i: a) => b
	then: <c>(g: Fun<b, c>) => Fun<a, c>
	// repeat: () => Fun<number, Fun<a, a>>
	// repeatUntil: () => Fun<Fun<a, boolean>, Fun<a, a>>
}

const fun = <a, b>(f: (_: a) => b): Fun<a, b> => ({
	f,
	then<c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> { return then(this, g) }
	/*repeat(this: Fun<a, a>): Fun<number, Fun<a, a>> {
		return fun(n => repeat(this, n))
	},
	repeatUntil(this: Fun<a, a>): Fun<Fun<a, boolean>, Fun<a, a>> {
		return fun(predicate => repeatUntil(this, predicate))
    }
})

const then = <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> => {
	return fun<a, c>(a => g.f(f.f(a)))
}*/

type Option<a> = ({
	kind: "some"
	value: a
} | {
	kind: "none"
}) & {
	map: <b>(this: Option<a>, f: Fun<a, b>) => Option<b>
	join: (this: Option<Option<a>>) => Option<a>
	flatmap: <b>(this: Option<Option<a>>, f: Fun<a, b>) => Option<b>
}

const functionsOption = <a>() => ({
	map<b>(this: Option<a>, f: Fun<a, b>): Option<b> { return mapOption(this, f) },
	join(this: Option<Option<a>>): Option<a> { return joinOption(this) },
	flatmap<b>(this: Option<Option<a>>, f: Fun<a, b>): Option<b> { return flatmapOption(this, f) }
})

const Onone = <a>(): Option<a> => ({ kind: "none", ...functionsOption<a>() })
const Osome = <a>(value: a): Option<a> => ({ kind: "some", value, ...functionsOption<a>() })

const mapOption = <a, b>(o: Option<a>, f: Fun<a, b>): Option<b> =>
	o.kind === "none"
	? Onone<b>()
	: Osome(f.f(o.value))

const joinOption = <a>(o: Option<Option<a>>): Option<a> =>
	o.kind === "none" ? Onone<a>() : o.value

const flatmapOption = <a, b>(o: Option<Option<a>>, f: Fun<a, b>): Option<b> =>  mapOption<a, b>(joinOption(o), f)




export type List<a> = ({
	kind: "Cons"
	head: a
	tail: List<a>
} | {
	kind: "Empty"
})
& {
	map: <b>(f: Fun<a, b>) => List<b>
	join: () => List<a>
	// encode: (shift: number) => List<string>
	// concat: (l: List<a>) => List<a>
}

const functionsList = <a>() => ({
	map<b>(this: List<a>, f: Fun<a, b>): List<b> { return fun<List<a>, List<b>>(l => mapList(l, f)).f(this) },
	join(this: List<List<a>>): List<a> { return joinList(this) },
	// encode(this: List<string>, shift: number): List<string> { return encode().f(shift).f(this) },
	// concat(this: List<a>, l: List<a>): List<a> { return joinList(some(this, some(l, none()))) }
})

export const some = <a>(head: a, tail: List<a>): List<a> => ({
	kind: "Cons",
	head,
	tail,
	...functionsList<a>()
})

export const none = <a>(): List<a> => ({
	kind: "Empty",
	...functionsList<a>()
})

const mapList = <a, b>(l: List<a>, f: Fun<a, b>): List<b> =>
	l.kind === "Empty" ? none<b>() : some(f.f(l.head), mapList(l.tail, f))

const joinList = <a>(l: List<List<a>>): List<a> => l.kind === "Empty"
	? none()
	: l.head.kind === "Empty"
	? joinList(l.tail)
	// : concatList(l.head, joinList(l.tail))
	: joinList(some(l.head, some(joinList(l.tail), none())))

/*type Omit<T, Condition extends keyof T> = Pick<T, {
	[K in keyof T]: K extends Condition ? never : K
}[keyof T]>

export default Omit*/


// table
/*export interface Table<a, b> {
	data: Array<a>
	result: Array<b>
	select: <k extends keyof a>(...keys: Array<k>) => Table<Omit<a, k>, Pick<a, k>>
}*/

/*const table = <a, b>(): Table<a, b> => {

}*/



