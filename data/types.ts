export interface Student {
	name: string
	surname: string
	age: number,
	course: Array<Course>
}

export interface Course {
	grade?: number
	courseId: string
}
