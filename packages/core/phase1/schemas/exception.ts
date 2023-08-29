import { z } from "zod"
import { ExceptionCode } from "../../types/ExceptionCode"

export const exceptionPathSchema = z.array(z.number().or(z.string()))

export const exceptionSchema = z.object({
  code: z.nativeEnum(ExceptionCode),
  path: exceptionPathSchema
})
