export interface Fun<a, b> {
	f: (_: a) => b
	then: <c>(g: Fun<b, c>) => Fun<a, c>
}

const fun = <a, b>(f: (_: a) => b): Fun<a, b> => ({
	f,
	then<c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
		return then<a, b, c>(this, g)
	}
})

const then = <a, b, c>(f: Fun<a, b>, g: Fun<b, c>): Fun<a, c> =>
 fun<a, c>(a => g.f(f.f(a)))

export interface Pair<a, b> {
	left: a,
	right: b
	map: <c, d>(f: Fun<a, c>, g: Fun<b, d>) => Pair<c, d>,
	mapLeft: <c, b>(f: Fun<a, c>) => Pair<c, b>
}

export type Id<a> = Fun<a, a>

const id = <a>(): Id<a> => fun<a, a>(a => a)

const pair = <a, b>(left: a, right: b): Pair<a, b> => ({
	left,
	right,
	map<c, d>(this: Pair<a, b>, f: Fun<a, c>, g: Fun<b, d>): Pair<c, d> { return mapPair<a, b, c, d>(f, g).f(this) },
	mapLeft<c, b>(this: Pair<a, b>, f: Fun<a, c>): Pair<c, b> { return mapPairLeft<a, b, c>(f).f(this) }
})

const mapPair = <a, b, c, d>(f: Fun<a, c>, g: Fun<b, d>): Fun<Pair<a, b>, Pair<c, d>> =>
	fun(p =>
		pair<c, d>(f.f(p.left), g.f(p.right))
	)

const mapPairLeft = <a, b, c>(f: Fun<a, c>): Fun<Pair<a, b>, Pair<c, b>> =>
		fun(p =>
			mapPair<a, b, c, b>(f, id<b>()).f(p)
		)

/*_________________________________________________________________________________________________________________*/

type Option<a> = {
	kind: "none"
} |
{
	kind: "some"
	value: a
}
& {
	map: <b>(f: Fun<a, b>) => Option<b>
}

const none = <a>(): Option<a> => ({ kind: "none"})
const some = <a>(value: a): Option<a> => ({ kind: "some", value, map<b>(f: Fun<a, b>) { return mapOption<a, b>(f).f(this) } })

// FUNCTOR (map)
export const mapOption = <a, b>(f: Fun<a, b>): Fun<Option<a>, Option<b>> =>
	fun<Option<a>, Option<b>>(o =>
		o.kind === "none" ? none<b>() : some<b>(f.f(o.value))
	)

// MONOID (unit & join)
const unitOption = <a>(): Option<a> => none<a>()
const joinOption = <a>(): Fun<Option<Option<a>>, Option<a>> =>
fun<Option<Option<a>>, Option<a>>(o =>
	o.kind === "none" ? none<a>() : none<a>()
) 

// MONAD (bind)
