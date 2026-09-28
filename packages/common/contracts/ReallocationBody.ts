import z from "zod"

export const ReallocationBodySchema = z.object({
  forceCode: z.string(),
  note: z.string()
})

export type ReallocationBody = z.infer<typeof ReallocationBodySchema>
