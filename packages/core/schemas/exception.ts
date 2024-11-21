import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { z } from "zod"

export const exceptionPathSchema = z.array(z.number().or(z.string()))

export const exceptionSchema = z.object({
  code: z.nativeEnum(ExceptionCode),
  path: exceptionPathSchema
})
