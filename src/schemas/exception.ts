import { ExceptionCode } from "../types/ExceptionCode"
import { z } from "zod"

export const exceptionPathSchema = z.array(z.number().or(z.string()))

export const exceptionSchema = z.object({
  code: z.nativeEnum(ExceptionCode),
  path: exceptionPathSchema
})
