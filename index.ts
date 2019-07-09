import table, {Table} from "./functors/table"
import {students} from "./data/school"
import { Grade } from "./data/types"
import { Unit } from "./functors/unit"

const studentTable = table(students)
console.log(studentTable.includes("grades", grades => grades.select("grade")).result)
