import { z } from "zod"
import { ExceptionCode } from "./ExceptionCode"

const exceptionPathSchema = z.array(z.number().or(z.string()))

export const exceptionSchema = z.object({
  code: z.nativeEnum(ExceptionCode),
  path: exceptionPathSchema
})

export type ExceptionPath = z.infer<typeof exceptionPathSchema>
type Exception = z.infer<typeof exceptionSchema>

export default Exception
