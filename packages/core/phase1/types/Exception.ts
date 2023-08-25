import type { z } from "zod"
import type { exceptionPathSchema, exceptionSchema } from "../schemas/exception"

export type ExceptionPath = z.infer<typeof exceptionPathSchema>
type Exception = z.infer<typeof exceptionSchema>

export default Exception
