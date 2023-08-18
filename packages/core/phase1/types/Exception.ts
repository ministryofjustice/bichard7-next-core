import type { exceptionPathSchema, exceptionSchema } from "../schemas/exception"
import type { z } from "zod"

export type ExceptionPath = z.infer<typeof exceptionPathSchema>
type Exception = z.infer<typeof exceptionSchema>

export default Exception
