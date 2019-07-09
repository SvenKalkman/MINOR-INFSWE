export interface Student {
	name: string
	surname: string
	age: number,
	grades: Array<Grade>
}

export interface Grade {
	grade?: number
	courseId: string
}
