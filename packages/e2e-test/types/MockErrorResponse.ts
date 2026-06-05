import errorResponseSchema from "@moj-bichard7/core/schemas/leds/errorResponseSchema"
import z from "zod"

export const mockErrorResponseSchema = errorResponseSchema.extend({
  gmh: z.string(),
  gmt: z.string()
})

export type MockErrorResponse = z.infer<typeof mockErrorResponseSchema>
