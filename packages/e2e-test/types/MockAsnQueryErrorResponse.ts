import z from "zod"

export const mockAsnQueryErrorResponseSchema = z.object({
  gmh: z.string(),
  txt: z.string(),
  gmt: z.string()
})

export type MockAsnQueryErrorResponse = z.infer<typeof mockAsnQueryErrorResponseSchema>
