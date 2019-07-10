import {Student} from "./types"

export const students: Array<Student> = [
	{
		name: "Sven",
		surname: "Kalkman",
		age: 20,
		course: [
			{ grade: 8, courseId: "INFDEV08-2" },
			{ grade: 6, courseId: "INFSWE01-1" }
		]
	},
	{
		name: "Rens",
		surname: "Boeser",
		age: 19,
		course: [
			{ grade: 10, courseId: "INFSWE01-1" },
			{ grade: 10, courseId: "INFSWE01-2" }
		]
	},
	{
		name: "Noah",
		surname: "Plazier",
		age: 20,
		course: [
			{ grade: 8, courseId: "INFSWE01-1" }
		]
	},
	{
		name: "Laurens",
		surname: "Ista",
		age: 20,
		course: [
			{ grade: 7, courseId: "INFSWE01-1" }
		]
	}
]
