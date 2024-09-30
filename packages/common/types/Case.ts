import { z } from "zod"

export const Case = z.object({
  error_id: z.number(),
  org_for_police_filter: z.string()
})

export type Case = z.infer<typeof Case>
