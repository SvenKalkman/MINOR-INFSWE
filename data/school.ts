import {Student} from "./types"

export const students: Array<Student> = [
	{
		name: "Sven",
		surname: "Kalkman",
		age: 20,
		grades: [
			{ grade: 8, courseId: "INFDEV08-1" },
			{ grade: 7, courseId: "INFDEV07-1" }
		]
	},
	{
		name: "Rens",
		surname: "Boeser",
		age: 19,
		grades: [
			{ grade: 10, courseId: "INFDEV08-1" },
			{ grade: 10, courseId: "INFDEV07-1" }
		]
	},
	{
		name: "Noah",
		surname: "Plazier",
		age: 20,
		grades: [
			{ grade: 8, courseId: "INFSWE01-1" }
		]
	},
	{
		name: "Laurens",
		surname: "Ista",
		age: 20,
		grades: [
			{ grade: 8, courseId: "INFSWE01-1" }
		]
	}
]

// select "name" => [{name: "name"}, {name: "name"}]
// select "grades" => [{grades: [{grade: ..., courseId: ...}]}]

// (include "grades", (gradeTable: Table<Grade, {}>) => gradeTable.select("grade")) Table<Omit<Grade, "grade">, Pick<Grade, "grade">> =>
// {name: "Name", grades: [{grade: ...}]}

// Omit<Grade, "grade">

// students.include("grades", (grades: Table<g, {}>) => Table<a, b>) => Table<Omit<Student, "grades", result & { grades: b }>

// 1) key argument van type Array<object>.
// 2) argument van type lambda: (t: Table<DATA_VAN_GESELECTEERDE_KEY, UNIT>) => Table<OVERIGE_DATA, RESULTAAT>
// 3) return type: Table<Omit<VORIGE_DATA, GESELECTEERDE_KEY>, VORIGE_RESULTAAT & { [GESELECTEERDE_KEY]: RESULTAAT }>

// Pair<a, b>
// Pair mapLeft
// Pair mapRight
// Pair map = Pair<mapLeft a, mapRight b>
