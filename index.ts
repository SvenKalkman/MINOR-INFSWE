import table from "./functors/table"
import {students} from "./data/school"

const studentTable = table(students)
console.log(JSON.stringify(studentTable.select("name").includes("course", course => course.select("grade", "courseId")).result))

// use 'npm start' to compile
